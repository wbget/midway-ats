import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';
import { AtomEntity } from '../entity/index.entity';

@Provide()
@Scope(ScopeEnum.Singleton)
export class MockService {
  @InjectDataSource()
  dataSource: DataSource;
  async clear() {
    await this.dataSource.transaction(async manager => {
      await manager.clear(AtomEntity);
    });
  }
}
