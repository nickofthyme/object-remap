import set from 'lodash.set';

import { getDefinedInputs, getUserInputs } from './inputs';
import { getMappedValues, trimByDepth } from './mappings';
import { DefinedInputs, KeyCase, KeyCasingFunction, UserInputs } from './types';
import { getCaseFunction } from './utils';

jest.mock('./inputs.ts');

const defaultDefinedInputs: DefinedInputs = {
  depth: 0,
  case: KeyCase.camel,
  deepCasing: false,
};

const MockInputs = {
  get simple() {
    return {
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
    };
  },
};

describe('#trimByDepth', () => {

  it('should trim depth to 0', () => {
    expect(trimByDepth(MockInputs.simple, getCaseFunction(KeyCase.snake), 0, false)).toEqual(MockInputs.simple);
  });

  it('should trim depth to 1', () => {
    const test = JSON.parse('{ "one": { "two": 2, "too_deep": { "three": 3 } }, "arr": [{ "two" : 2, "too_deep": { "three": 3 }}]}');
    expect(trimByDepth(test, getCaseFunction(KeyCase.snake), 2, true)).toEqual({
      one: {
        two: 2,
      },
      arr: [{
        two: 2,
      }],
    });
  });

  it('should trim depth to 2 from readme example', () => {
    expect(trimByDepth(MockInputs.simple, getCaseFunction(KeyCase.snake), 1, false)).toEqual({
      one: 1,
    });
  });

  it('should trim depth to 2', () => {
    expect(trimByDepth(MockInputs.simple, getCaseFunction(KeyCase.snake), 2, false)).toEqual({
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
    expect(trimByDepth(MockInputs.simple, getCaseFunction(KeyCase.snake), 3, false)).toEqual(MockInputs.simple);
  });
});

describe('#getMappedValues', () => {
  let definedInputs: DefinedInputs;
  let userInputs: UserInputs;

  (getDefinedInputs as jest.Mock).mockImplementation(() => definedInputs);
  (getUserInputs as jest.Mock).mockImplementation(() => userInputs);

  beforeEach(() => {
    definedInputs = defaultDefinedInputs;
    userInputs = {};
  });

  const getExpected = (depth: number, key: string, casingFunction: KeyCasingFunction, value: any): any => ({
    [casingFunction(key)]: depth === 1 ? value : getExpected(depth - 1, key, casingFunction, value),
  });

  it('should prevent assigning \'__proto__\'', () => {
    userInputs = { '__proto__.test': 'bad' };
    expect(getMappedValues().test).not.toBeDefined();
  });

  it('should handle top level array values', () => {
    userInputs = { 'arr': ['one', 'two'] };
    expect(getMappedValues().arr).toEqual(['one', 'two']);
  });

  describe.each<[string, number]>([
    ['single', 1],
    ['double', 2],
    ['triple', 3],
  ])(
    'nested %s depth dot path',
    (_, depth) => {
      describe.each([
        ['single', 'test'],
        ['multi', 'test_prop'],
        ['long multi', 'test_prop_long'],
      ])(
        '%s-word keys',
        (__, rawKey) => {
          const key = new Array(depth).fill(rawKey).join('.');
          describe.each(Object.values(KeyCase))(
            'key case - %s',
            (keyCase) => {
              const casingFunction = getCaseFunction(keyCase, true);
              it.each([
                'string',
                false,
                true,
                123,
                { testing: 123 },
                [1, 2, 3, 4],
              ])(
                'should set %s value',
                (value) => {
                  userInputs = { [key]: value };
                  definedInputs = { ...defaultDefinedInputs, case: keyCase  };
                  expect(getMappedValues()).toEqual(getExpected(depth, rawKey, casingFunction, value));
                },
              );
            },
          );
        },
      );
    },
  );

  describe('deepCasing', () => {
    const testObj = {
      test_prop: {
        test_prop: 'value',
      },
    };
    it('should not case keys in value when shallow', () => {
      definedInputs = { ...defaultDefinedInputs, deepCasing: true, case: KeyCase.camel };
      userInputs = { 'user_key.user_key': testObj };
      expect(getMappedValues()).toEqual({
        userKey: {
          userKey: testObj,
        },
      });
    });

    it('should case keys in value when NOT shallow', () => {
      definedInputs = { ...defaultDefinedInputs, deepCasing: false, case: KeyCase.camel };
      userInputs = { 'user_key.user_key': testObj };
      expect(getMappedValues()).toEqual({
        userKey: {
          userKey: getExpected(2, 'test_prop', getCaseFunction(KeyCase.camel), 'value'),
        },
      });
    });
  });


  describe('unfiltering', () => {
    const getUnfilteredExpected = (path: string, values: any[]): any => {
      const obj = {};
      const casingFunction = getCaseFunction(KeyCase.camel);
      const [, first, second] = /(.*?)\.\*\.(.*)/.exec(casingFunction(path)) ?? [];
      set(obj, first, values.map((v) => {
        const subObj = {};
        set(subObj, second, v);
        return subObj;
      }));
      return obj;
    };

    describe.each([
      ['single', 'test.*.prop'],
      ['multi', 'test_prop.*.test_prop'],
      ['multi pre deep', 'test.test_prop.*.prop'],
      ['multi post deep', 'test.*.test_prop.prop'],
    ])(
      '%s path',
      (_, path) => {
        it.each<[string, any[]]>([
          ['string', ['string1', 'string2']],
          ['boolean', [false, true]],
          ['number', [1, 2, 3, 4, 5]],
          ['object', [{ prop: 1 }, { prop: 2 }]],
          ['array', [[1, 2], [3, 4]]],
          ['mixed', [true, 'two', 3, { four: 4 }, [5, 6]]],
        ])('should set %s values from unfiltered dot path', (__, value) => {
          userInputs = { [path]: value };

          expect(getMappedValues()).toEqual(getUnfilteredExpected(path, value));
        });
      },
    );

    it('should add to existing nested values', () => {
      userInputs = {
        'test.*.prop1': [1, 2],
        'test.*.prop2': [3, 4, 5],
      };

      expect(getMappedValues()).toEqual({
        test: [
          {
            prop1: 1,
            prop2: 3,
          },
          {
            prop1: 2,
            prop2: 4,
          },
          {
            prop2: 5,
          },
        ],
      });
    });

    it('should override existing values', () => {
      userInputs = {
        'test.*.key': [{ deep: 'before' }],
        'test.*.key.deep': ['after'],
      };

      expect(getMappedValues()).toEqual({
        'test':  [
          {
            'key':  {
              'deep': 'after',
            },
          },
        ],
      });
    });


    it('should not create object with missing second key', () => {
      userInputs = {
        'test.*.': [1, 2, 3],
      };

      expect(getMappedValues()).toEqual({});
    });

    it('should not create object with missing first key', () => {
      userInputs = {
        '.*.test': [1, 2, 3],
      };

      expect(getMappedValues()).toEqual({});
    });

    it('should not set values with missing nested key', () => {
      userInputs = {
        'test.*.key': [1],
        'test.*.': [1, 2, 3],
      };

      expect(getMappedValues()).toEqual({
        test: [{ key: 1 }],
      });
    });

    it('should bail if value is not an array', () => {
      userInputs = {
        'test.*.key': 'not an array',
      };

      expect(getMappedValues()).toEqual({});
    });
  });
});
