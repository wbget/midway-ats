import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource } from 'typeorm';
import { AtomEntity } from '../entity/index.entity';
import { TestTrait0, TestTrait1, TestTransaction } from '../entity/test.entity';
import { ATSService, WithTransaction } from '../../../../src';

@Provide()
@Scope(ScopeEnum.Singleton)
export class MockService {
  @Inject()
  ats: ATSService;
  @InjectDataSource()
  dataSource: DataSource;
  async clear() {
    await this.dataSource.transaction(async manager => {
      await manager.clear(TestTransaction);
      await manager.clear(TestTrait1);
      await manager.clear(TestTrait0);
      await manager.clear(AtomEntity);
    });
  }
  @WithTransaction()
  async stop() {
    const id2 = await this.ats.addAtom();
    const t2 = await this.ats.createTrait(TestTransaction, id2);
    await this.ats.saveTrait(t2);
    throw new Error('stop');
  }
}
