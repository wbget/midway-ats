import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';
import { AtomEntity } from '../entity/index.entity';
import { TestTrait0, TestTrait1 } from '../entity/test.entity';

@Provide()
@Scope(ScopeEnum.Singleton)
export class MockService {
  @InjectDataSource()
  dataSource: DataSource;
  async clear() {
    await this.dataSource.transaction(async manager => {
      await manager.clear(TestTrait1);
      await manager.clear(TestTrait0);
      await manager.clear(AtomEntity);
    });
  }
}
