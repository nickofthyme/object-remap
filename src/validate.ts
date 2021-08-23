import * as core from '@actions/core';
import Joi from 'joi';

import { DefinedInputs, KeyCase, UnknownRecord } from './types';

const definedInputSchema = Joi.object<DefinedInputs>({
  depth: Joi.number()
    .label('__depth')
    .min(0)
    .default(0),
  case: Joi.string()
    .label('__case')
    .valid(...Object.values(KeyCase))
    .default(KeyCase.camel),
  deepCasing: Joi.boolean()
    .label('__deep_casing')
    .default(false),
});

const definedInputSchemaFailover = Joi.object<DefinedInputs>({
  depth: definedInputSchema.extract('depth').failover(0),
  case: definedInputSchema.extract('case').failover(KeyCase.camel),
  deepCasing: definedInputSchema.extract('deepCasing').failover(false),
});

export function validateDefinedInputs(inputs: UnknownRecord): DefinedInputs {
  const { error } = definedInputSchema.validate(inputs, { abortEarly: false, stripUnknown: true  });

  if (error) {
    core.error('-------------- Input errors --------------');
    for (const { message } of error.details) {
      core.error(`${message}. Using default value instead.`);
    }
    core.error('------------------------------------------');
  }

  return definedInputSchemaFailover.validate(inputs, { stripUnknown: true }).value as DefinedInputs;
}
