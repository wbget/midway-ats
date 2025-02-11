import {
  Configuration,
  ILogger,
  Inject,
  JoinPoint,
  Logger,
  MidwayDecoratorService,
  REQUEST_OBJ_CTX_KEY,
} from '@midwayjs/core';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as uuid from '@wbget/midway-uuid-int';
import * as koa from '@midwayjs/koa';
import { TRANSACTION_KEY } from './transaction/interface.transaction';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';
import { ATSService } from './service/ats.service';

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
            const instance = joinPoint.target;
            const ctx = instance[REQUEST_OBJ_CTX_KEY];
            const ats = await ctx.requestContext.getAsync(ATSService);
            const old = ats.manager;
            ats.manager = manager;
            const result = await joinPoint.proceed(...joinPoint.args);
            ats.manager = old;
            return result;
          });
        },
      };
    });
  }
}
