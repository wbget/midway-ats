import { Configuration } from '@midwayjs/core';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as uuid from '@wbget/midway-uuid-int';

@Configuration({
  namespace: 'ats',
  importConfigs: [
    {
      importConfigs: [join(__dirname, './config')],
    },
  ],
  imports: [typeorm, uuid],
})
export class ATSConfiguration {
  async onReady() {}
}
