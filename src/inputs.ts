import { camelCase } from 'change-case';

import { UserInputs, KeyCase, DefinedInputs, UnknownRecord } from './types';
import { getCaseFunction, parseValue } from './utils';
import { validateDefinedInputs } from './validate';

export function getDefinedInputs(): DefinedInputs {
  const definedInputs = (Object.entries(process.env) ?? []).reduce<UnknownRecord>((result, [key, value]) => {
    if (!key.startsWith('INPUT___') || value === undefined) return result;

    const inputKey = camelCase(key.slice('INPUT___'.length));

    try {
      result[inputKey] = JSON.parse(value) as unknown;
    } catch {
      result[inputKey] = value;
    }
    return result;
  }, {});

  return validateDefinedInputs(definedInputs);
}

export function getUserInputs(keyCase: KeyCase): UserInputs {
  const casingFunction = getCaseFunction(keyCase);

  return (Object.entries(process.env) ?? []).reduce<UserInputs>((result, [key, value]) => {
    if (!key.startsWith('INPUT_') || key.startsWith('INPUT___') || value === undefined) {
      return result;
    }

    // case is obfiscated in process.args assumed as upper snake case
    const inputName = casingFunction(key.slice('INPUT_'.length));

    // All values are stringified from GH, try to parse typed value
    result[inputName] = parseValue(value);

    return result;
  }, {});
}
