import { Configuration } from '@midwayjs/core';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as uuid from '@wbget/midway-uuid-int';
import * as koa from '@midwayjs/koa';

@Configuration({
  namespace: 'ats',
  importConfigs: [
    {
      importConfigs: [join(__dirname, './config')],
    },
  ],
  imports: [koa, typeorm, uuid],
})
export class ATSConfiguration {
  async onReady() {}
}
