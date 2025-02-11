import { createCustomMethodDecorator } from '@midwayjs/core';
import { TRANSACTION_KEY } from './interface.transaction';

export function WithTransaction(): MethodDecorator {
  return createCustomMethodDecorator(TRANSACTION_KEY, {});
}
