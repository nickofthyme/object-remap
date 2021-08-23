import { KeyCase } from './types';
import { getCaseFunction, parseValue } from './utils';


const test: any = {
  test2: 1,
  test1: 2,
};

describe('#parseValue', () => {
  it('should parse string if possible', () => {
    expect(parseValue(JSON.stringify(test))).toEqual(test);
  });

  it('should parse a simple string', () => {
    const string = 'Hello there!';
    expect(parseValue(string)).toEqual(string);
  });

  it('should handle failing to parse string', () => {
    const string = '////{ bad value';
    expect(parseValue(string)).toEqual(string);
  });

  it('should return values other than strings', () => {
    const number = 123;
    expect(parseValue(number)).toEqual(number);
  });
});

describe('#getCaseFunction', () => {

  describe.each<KeyCase>(Object.values(KeyCase))('%s', (keyCase) => {
    const casingFunction = getCaseFunction(keyCase);

    it.each<[string, Partial<Record<KeyCase, string>>]>([
      ['single', { upper: 'SINGLE', pascal: 'Single', kebab: 'single' }],
      ['multi_word', { upper: 'MULTI_WORD', pascal: 'MultiWord', camel: 'multiWord', kebab: 'multi-word' }],
      ['single.*.single', { upper: 'SINGLE.*.SINGLE', pascal: 'Single.*.Single', kebab: 'single.*.single' }],
      ['single.*.multi_word', { upper: 'SINGLE.*.MULTI_WORD', pascal: 'Single.*.MultiWord', camel: 'single.*.multiWord', kebab: 'single.*.multi-word' }],
      ['multi_word.*.multi_word', { upper: 'MULTI_WORD.*.MULTI_WORD', pascal: 'MultiWord.*.MultiWord', camel: 'multiWord.*.multiWord', kebab: 'multi-word.*.multi-word' }],
    ])('should correctly convert from "%s"', (initial, expected) => {
      expect(casingFunction(initial)).toBe(expected[keyCase] ?? initial);
    });
  });
});
