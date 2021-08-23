import { camelCase, pascalCase, snakeCase, paramCase } from 'change-case';

import { KeyCase, KeyCasingFunction } from './types';

/**
 * Handles splitting top level keys with dot and unfiltering cases
 */
const splitCaseJoin = (caseFunction: KeyCasingFunction): KeyCasingFunction => (s) => s
  .split('.')
  .map((p) => (p === '*' ? p : caseFunction(p)))
  .join('.');
const caseMap: Record<KeyCase, (deep: boolean) => KeyCasingFunction> = {
  snake: (d) => d ? snakeCase : splitCaseJoin(snakeCase),
  camel:  (d) => d ? camelCase : splitCaseJoin(camelCase),
  pascal:  (d) => d ? pascalCase : splitCaseJoin(pascalCase),
  kebab:  (d) => d ? paramCase : splitCaseJoin(paramCase),
  upper: () => (s) => s.toUpperCase(),
  lower: () => (s) => s.toLowerCase(),
};
export const getCaseFunction = (keyCase: KeyCase, deep = false): ((s: string) => string) => {
  return caseMap[keyCase](deep);
};

export function parseValue(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}
