import * as core from '@actions/core';
import get from 'get-value';
import set from 'set-value';

import { getDefinedInputs, getUserInputs } from './inputs';
import { KeyCasingFunction, UnknownRecord } from './types';
import { getCaseFunction } from './utils';

export function trimByDepth<T extends UnknownRecord, O extends UnknownRecord = UnknownRecord>(
  obj: T,
  casingFunction: KeyCasingFunction,
  depth: number,
  deepCasing: boolean,
): O {
  if (deepCasing ) {
    renameKeys(obj, casingFunction);
  }

  if (depth === 0 && !deepCasing) return obj as unknown as O;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key] as O | O[];

      if (Array.isArray(value)) {
        if (depth === 1) delete obj[key];
        else for (const arrValue of value) {
          if (typeof arrValue === 'object' && typeof arrValue !== null) {
            trimByDepth(arrValue, casingFunction, depth - 1, deepCasing); // arrays indices don't count on depth
          }
        }
      } else if (typeof value === 'object' && typeof value !== null) {
        if (depth === 1) delete obj[key];
        else trimByDepth(obj[key] as T, casingFunction, depth - 1, deepCasing);
      }
    }
  }

  return obj as unknown as O;
}

function renameKeys(obj: UnknownRecord | UnknownRecord[], casingFunction: KeyCasingFunction) {
  if (!Array.isArray(obj)) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        delete obj[key];
        obj[casingFunction(key)] = value;
      }
    }
  }
}

export function getMappedValues(): UnknownRecord {
  const { depth, case: keyCase, deepCasing } = getDefinedInputs();
  const inputs = getUserInputs(keyCase);
  const casingFunction = getCaseFunction(keyCase);

  const newMappings: UnknownRecord = {};
  Object.freeze((newMappings as any).__proto__);

  let count = Object.keys(inputs).length;

  core.info('--------- Inputs ---------');

  for (const inputPath in inputs) {
    count--;
    if (inputs.hasOwnProperty(inputPath)) {
      const casedInputPath = casingFunction(inputPath);
      const re = /(.*?)\.\*\.(.*)/;
      const value = inputs[inputPath];

      core.info(`path: ${casedInputPath}`);
      core.info(`type: ${Array.isArray(value) ? 'array' : typeof value}`);
      core.info(`value: ${JSON.stringify(value)}`);

      if (re.test(casedInputPath)) {
        if (!Array.isArray(value)) {
          continue;
        }

        const [, first, second] = re.exec(casedInputPath) ?? [];
        const current = get(newMappings, first);
        const newCurrent = (!Array.isArray(current)
          ? []
          : (typeof current[0] === 'object' && current[0] !== null
              ? current
              : [])) as UnknownRecord[];

        for (const [index, el] of value.entries()) {
          if (first === '' || second === '') {
            core.warning(`Invalid path for '${inputPath}', must specify a key (e.g. 'key1.*.key2')`);
          } else {
            const element = newCurrent[index] ?? {};
            set(element, second, el);
            newCurrent[index] = element;
          }
        }

        if (newCurrent.length > 0) {
          set(newMappings, first, newCurrent);
        }
      } else {
        set(newMappings, casedInputPath, value);
      }

      if (count) core.info('--------------------------');
    }
  }

  const casingFunctionDeep = getCaseFunction(keyCase, true);
  return trimByDepth(newMappings, casingFunctionDeep, depth, deepCasing);
}
