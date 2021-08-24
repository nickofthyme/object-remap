import { parseValue, getAllInputs, trimByDepth, getMappedValues, InputCase, getCaseFunction } from './main';

const object: any = {
  test2: 1,
  test1: 2,
};

describe('#parseValue', () => {
  it('should parse string if possible', () => {
    expect(parseValue(JSON.stringify(object))).toEqual(object);
  });

  it('should parse a simple string', () => {
    const string = 'Hello there!';
    expect(parseValue(string)).toEqual(string);
  });
});

describe('#getCaseFunction', () => {
  it.each<[string, InputCase]>([
    ['single', 'camel'],
    // ['camelCase', 'camel'],
    ['snake_case', 'snake'],
    ['lower_case', 'lower'],
    ['UPPER_CASE', 'upper'],
    ['__leading', 'lower'],
  ])('should return %s string in %s case', (testString, c) => {
    expect(getCaseFunction(c)(testString.toUpperCase())).toBe(testString);
  });
});

describe('#getAllInputs', () => {
  afterEach(() => {
    process.env = {};
  });

  it.each<[InputCase, string]>([
    ['camel', 'someVariable'],
    ['snake', 'some_variable'],
    ['pascal', 'SomeVariable'],
    ['upper', 'SOME_VARIABLE'],
    ['lower', 'some_variable'],
  ])('should return correct inputs for %s case', (c, key) => {
    process.env.INPUT_SOME_VARIABLE = 'testing';
    process.env.INPUT___CASE = c;
    expect(getAllInputs()).toEqual({
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
    expect(getAllInputs()).toEqual({
      [key]: value as unknown,
    });
    delete process.env[`INPUT_${key.toUpperCase()}`];
  });

  it('should return req string when JSON.parse fails', () => {
    const key = 'test_key';
    const badJson = '{{{ not valid json }';
    process.env[`INPUT_${key.toUpperCase()}`] = badJson;
    expect(getAllInputs()).toEqual({
      [key]: badJson,
    });
  });
});

describe('#trimByDepth', () => {
  const getTestObject = () => ({
    one: 1,
    two: {
      one: 1,
    },
    three: {
      two: {
        one: 1,
      },
    },
    numbers: [1, 2, 3],
    array: [
      {
        test: 'key1',
        deeper: {
          deep: 1,
        },
      },
      {
        test: 'key2',
      },
    ],
  });

  it('should trim depth to 0', () => {
    expect(trimByDepth(getTestObject(), 0)).toEqual(getTestObject());
  });

  it('should trim depth to 1', () => {
    expect(trimByDepth(getTestObject(), 1)).toEqual({
      one: 1,
    });
  });

  it('should trim depth to 2', () => {
    expect(trimByDepth(getTestObject(), 2)).toEqual({
      one: 1,
      two: {
        one: 1,
      },
      three: {},
      numbers: [1, 2, 3],
      array: [
        {
          test: 'key1',
        },
        {
          test: 'key2',
        },
      ],
    });
  });

  it('should trim depth to 3', () => {
    expect(trimByDepth(getTestObject(), 3)).toEqual(getTestObject());
  });
});

describe('#getMappedValues', () => {
  afterEach(() => {
    process.env = {};
  });

  it.each([
    'string',
    false,
    true,
    123,
  ])('should set %s values from dot path', (value) => {
    const key = 'test.prop';
    process.env[`INPUT_${key.toUpperCase()}`] = value.toString();
    expect(getMappedValues()).toEqual({
      test: {
        prop: value,
      },
    });
  });

  it.each<any[]>([
    ['string1', 'string2'],
    [false, true],
    [1, 2, 3, 4, 5],
  ])('should set %s values from unfiltering dot path', (...value) => {
    const key = 'test.*.prop';
    process.env[`INPUT_${key.toUpperCase()}`] = JSON.stringify(value);

    expect(getMappedValues()).toEqual({
      test: value.map((v) => ({
        prop: v as unknown,
      })),
    });
  });
});
