import { snakeCase } from 'change-case';

import { getDefinedInputs, getUserInputs } from './inputs';
import { DefinedInputs, KeyCase, UnknownRecord } from './types';

describe('#getDefinedInputs', () => {
  const defaultInputs = {
    'case': KeyCase.camel,
    'depth': 0,
    'deepCasing': false,
  };
  const setArguments = (inputs: Partial<DefinedInputs>) => {
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        process.env[`INPUT___${snakeCase(key).toUpperCase()}`] = (inputs as any)[key];
      }
    }
  };

  afterEach(() => {
    process.env = {};
  });

  it.each<[UnknownRecord, DefinedInputs]>([
    [{}, defaultInputs],
    [{ depth: -1 }, defaultInputs],
    [{ depth: 5 }, { ...defaultInputs, depth: 5 }],
    [{ case: KeyCase.pascal }, { ...defaultInputs, case: KeyCase.pascal }],
    [{ case: 'noop' }, defaultInputs],
    [{ deepCasing: 'noop' }, defaultInputs],
    [{ deepCasing: true }, { ...defaultInputs, deepCasing: true }],
    [{ depth: 10, case: KeyCase.camel, deepCasing: true }, { depth: 10, case: KeyCase.camel, deepCasing: true }],
    [{ notAValidProp: 'noop' }, defaultInputs],
  ])('should return correct inputs from %s', (initial, expected) => {
    setArguments(initial);
    expect(getDefinedInputs()).toEqual(expected);
  });
});

describe('#getUserInputs', () => {
  afterEach(() => {
    process.env = {};
  });

  it.each<[KeyCase, string]>([
    [KeyCase.snake, 'some_variable'],
    [KeyCase.camel, 'someVariable'],
    [KeyCase.pascal, 'SomeVariable'],
    [KeyCase.upper, 'SOME_VARIABLE'],
    [KeyCase.lower, 'some_variable'],
    [KeyCase.kebab, 'some-variable'],
  ])('should return correct inputs for %s case', (c, key) => {
    process.env.INPUT_SOME_VARIABLE = 'testing';
    process.env.INPUT___CASE = c;
    expect(getUserInputs(c)).toEqual({
      [key]: 'testing',
    });
  });

  it.each<[string, any]>([
    ['number', 1],
    ['string', 'some string'],
    ['false', false],
    ['true', true],
    ['json', { testing: 1 }],
  ])('should parse %s for %s', (key, value) => {
    process.env[`INPUT_${key.toUpperCase()}`] = JSON.stringify(value);
    expect(getUserInputs(KeyCase.snake)).toEqual({
      [key]: value as unknown,
    });
    delete process.env[`INPUT_${key.toUpperCase()}`];
  });

  it('should return req string when JSON.parse fails', () => {
    const key = 'test_key';
    const badJson = '{{{ not valid json }';
    process.env[`INPUT_${key.toUpperCase()}`] = badJson;
    expect(getUserInputs(KeyCase.snake)).toEqual({
      [key]: badJson,
    });
  });
});
