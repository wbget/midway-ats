import { Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { UUIDIntService } from '@wbget/midway-uuid-int';
import { DataSource, EntityManager, EntityTarget, In } from 'typeorm';
import { Trait } from '../interface';
import { AtomEntity } from '../entity/ats.entity';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ATSService {
  @InjectDataSource()
  dataSource: DataSource;
  @Inject()
  private uuid: UUIDIntService;

  manager: EntityManager;

  @Init()
  async init() {
    this.manager = this.dataSource.manager;
  }
  async addAtom() {
    const atom = this.manager.create(AtomEntity);
    atom.id = this.uuid.uuid() + '';
    await this.manager.save(atom);
    return atom.id;
  }
  async delAtom(id: string) {
    await this.manager.delete(AtomEntity, { id });
  }
  async createTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    id: string
  ) {
    const entity = this.manager.create(trait);
    entity.id = id;
    return entity;
  }
  async saveTrait<Entity extends Trait>(trait: Entity) {
    await this.manager.save(trait);
  }
  async delTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    id: string
  ) {
    await this.manager.delete(trait, { id });
  }
  async getTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    id: string
  ) {
    return (await this.manager.findOne<Trait>(trait, {
      where: { id },
    })) as Entity;
  }
  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    ids: string[] = null
  ) {
    if (ids === null) {
      return this.manager.find(trait);
    } else {
      return (await this.manager.find<Trait>(trait, {
        where: { id: In(ids) },
      })) as Entity[];
    }
  }

  /**
   *
   * @param traits 按顺序过滤，传参数时请按照从最细到最宽的顺序传递
   * @returns
   */
  async getAtoms<Entity extends Trait>(traits: EntityTarget<Entity>[]) {
    if (traits.length === 0) {
      return [];
    }
    // TODO 加速查找
    const atoms: Entity[] = await this.manager.find(traits[0], {
      select: ['id'],
    });
    let ids = atoms.map(atom => atom.id);
    if (traits.length === 1) {
      return ids;
    }
    for await (const entity of traits.slice(1)) {
      const tids = await this.manager.find<Trait>(entity, {
        select: ['id'],
        where: { id: In(ids) },
      });
      ids = tids.map(id => id.id);
    }
    return ids;
  }
}
