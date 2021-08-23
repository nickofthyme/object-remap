export enum KeyCase {
  snake = 'snake',
  camel = 'camel',
  pascal = 'pascal',
  upper = 'upper',
  lower = 'lower',
  kebab = 'kebab',
}

export interface DefinedInputs {
  depth: number;
  case: KeyCase;
  deepCasing: boolean;
}

export type KeyCasingFunction = (s: string) => string;

export type UnknownRecord = Record<string, unknown>;

export type UserInputs = UnknownRecord;

export type UserMappings = UnknownRecord;
