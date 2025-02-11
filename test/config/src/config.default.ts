import { MidwayConfig } from '@midwayjs/core';

export const typeorm = {
  dataSource: {
    default: {
      type: 'mysql',
      synchronize: true,
      port: 3306,
      host: 'localhost',
      database: 'menu',
      username: 'root',
      password: '123456',
      timezone: '+08:00',
      entities: ['**/entity/**/*{.ts,.js}'],
      // logging: ['warn', 'error'],
    },
  },
};
export const keys = '1690787174847_696';
export const koa = {
  port: 7001,
};
export const midwayLogger: MidwayConfig['midwayLogger'] = {
  default: {
    level: 'error',
  },
};
