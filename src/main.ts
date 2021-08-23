import * as core from '@actions/core';

import { getMappedValues } from './mappings';

export function run(): void {
  try {
    const newMappings = getMappedValues();
    const json = JSON.stringify(newMappings);

    core.info('--------- Output ---------');
    core.info('Remapped json:');
    core.info(JSON.stringify(newMappings, null, 2));
    core.setOutput('json', json);
  } catch (error) {
    core.setFailed(error as Error);
  }
}

void run();
