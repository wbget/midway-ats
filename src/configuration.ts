import {
  Configuration,
  ILogger,
  Inject,
  JoinPoint,
  Logger,
  MidwayDecoratorService,
} from '@midwayjs/core';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as uuid from '@wbget/midway-uuid-int';
import * as koa from '@midwayjs/koa';
import { TRANSACTION_KEY } from './transaction/interface.transaction';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';

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
  @Inject()
  decoratorService: MidwayDecoratorService;
  @InjectDataSource()
  private dataSource: DataSource;
  @Logger()
  logger: ILogger;

  async onReady() {
    this.decoratorService.registerMethodHandler(TRANSACTION_KEY, options => {
      return {
        around: async (joinPoint: JoinPoint) => {
          return this.dataSource.manager.transaction(async manager => {
            return joinPoint.proceed(manager, ...joinPoint.args);
          });
        },
      };
    });
  }
}
