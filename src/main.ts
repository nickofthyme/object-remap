import core from '@actions/core';
import { camelCase, pascalCase, snakeCase } from 'change-case';
import get from 'lodash.get';
import set from 'lodash.set';

export type InputCase = 'snake' | 'camel' | 'pascal' | 'lower' | 'upper';
export interface Inputs {
  __depth: number;
  __case?: InputCase;
  [key: string]: unknown;
}

export function parseValue(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
      // Needed if user input data uses one too many `toJSON` calls
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}

const caseMap: Record<InputCase, (s: string) => string> = {
  snake: (s) =>
    s
      .split('.')
      .map((p) => (p === '*' ? p : snakeCase(p)))
      .join('.'),
  camel: (s) =>
    s
      .split('.')
      .map((p) => (p === '*' ? p : camelCase(p)))
      .join('.'),
  pascal: (s) =>
    s
      .split('.')
      .map((p) => (p === '*' ? p : pascalCase(p)))
      .join('.'),
  lower: (s) => s.toLowerCase(),
  upper: (s) => s.toUpperCase(),
};
export const getCaseFunction = (stringCase: InputCase = 'snake') => {
  return caseMap[stringCase];
};

export function getAllInputs(): Inputs {
  const casingFunction = getCaseFunction(process.env.INPUT___CASE as any);
  core.info(`CASe ----> ${process.env.INPUT___CASE ?? ''}`);

  return (Object.entries(process.env) ?? []).reduce((result, [key, value]) => {
    if (
      !key.startsWith('INPUT_') ||
      value === undefined ||
      key === 'INPUT___CASE'
    )
      return result;
    // TODO: configure casing since obfiscated in process.args
    const inputName = casingFunction(key.slice('INPUT_'.length));

    core.info(`CASSING ----> before: ${key} after: ${inputName}`);

    try {
      // All values are stringified so try to parse typed value
      result[inputName] = JSON.parse(value) as unknown;
    } catch {
      result[inputName] = value;
    }
    return result;
  }, {} as Inputs);
}

export function trimByDepth(
  object: Record<string, unknown>,
  depth?: number,
): Record<string, unknown> {
  if (!depth) return object;

  for (const key in object) {
    const value = object[key];

    if (Array.isArray(value)) {
      if (depth === 1) delete object[key];
      else for (const o of value) trimByDepth(o, depth - 1); // arrays indices don't count on depth
    } else if (typeof value === 'object' && typeof value !== null) {
      if (depth === 1) delete object[key];
      else trimByDepth(object[key] as Record<string, unknown>, depth - 1);
    }
  }

  return object;
}

export function getMappedValues(): Record<string, unknown> {
  const { __depth, ...inputs } = getAllInputs();
  const newMappings: Record<string, unknown> = {};
  Object.freeze((newMappings as any).__proto__);
  let count = Object.keys(inputs).length;

  core.info('--------- Inputs ---------');

  for (const inputPath in inputs) {
    count--;
    if (inputs.hasOwnProperty(inputPath)) {
      const re = /(.+?)\.\*\.(.+)/;
      const value = inputs[inputPath];
      const truncValue =
        typeof value === 'string' && value.length > 200
          ? `${value.slice(0, 200)}...`
          : (value as string);
      core.info(`path: ${inputPath}`);
      core.info(`type: ${typeof value}`);
      core.info(`value: ${truncValue}`);

      const parsedValue = parseValue(value);

      if (re.test(inputPath)) {
        if (!Array.isArray(parsedValue)) {
          continue;
        }

        const [, first, second] = re.exec(inputPath) || [];
        const current = get(newMappings, first);
        const newCurrent = (!Array.isArray(current)
          ? []
          : (typeof current[0] === 'object' && current[0] !== null
              ? current
              : [])) as Record<string, unknown>[];

        for (const [index, element_] of parsedValue.entries()) {
          const element = newCurrent[index] || {};
          set(element, second, element_);
          newCurrent[index] = element;
        }

        set(newMappings, first, newCurrent);
      } else {
        set(newMappings, inputPath, parsedValue);
      }

      if (count) core.info('--------------------------');
    }
  }

  return trimByDepth(newMappings, __depth);
}

function run(): void {
  try {
    const newMappings = getMappedValues();
    const json = JSON.stringify(newMappings);

    core.info('--------- Output ---------');
    core.info('Remapped json:');
    core.info(JSON.stringify(newMappings, null, 2));
    core.setOutput('json', json);
  } catch (error) {
    core.setFailed(error.message);
  }
}

void run();
