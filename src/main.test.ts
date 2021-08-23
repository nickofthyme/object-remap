import * as core from '@actions/core';

import { run } from './main';
import { getMappedValues } from './mappings';

jest.mock('./mappings');

describe('#run', () => {
  const testObj = {
    test: {
      number: 1,
      string: 'two',
      boolean: false,
      array: [1, 2, 3],
      obj: { key: 'value' },
    },
  };

  it('should set final value', () => {
    (getMappedValues as jest.Mock).mockReturnValue(testObj);
    run();

    expect(core.setOutput).toBeCalledWith('json', JSON.stringify(testObj));
  });

  it('should setFailed on error', () => {
    const error = new Error('test error');
    (getMappedValues as jest.Mock).mockImplementation(() => { throw error; });
    run();
    expect(core.setFailed).toBeCalledWith(error);
  });
});
