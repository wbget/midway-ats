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
    atom.aid = this.uuid.uuid() + '';
    await this.manager.save(atom);
    return atom.aid;
  }
  async delAtom(aid: string) {
    await this.manager.delete(AtomEntity, { aid });
  }
  async createTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    aid: string
  ) {
    const entity = this.manager.create(trait);
    entity.aid = aid;
    return entity;
  }
  async saveTrait<Entity extends Trait>(trait: Entity) {
    await this.manager.save(trait);
  }
  async delTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    aid: string
  ) {
    await this.manager.delete(trait, { aid });
  }
  async getTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    aid: string
  ) {
    return (await this.manager.findOne<Trait>(trait, {
      where: { aid },
    })) as Entity;
  }
  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    aids: string[] = null
  ) {
    if (aids === null) {
      return this.manager.find(trait);
    } else {
      return (await this.manager.find<Trait>(trait, {
        where: { aid: In(aids) },
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
      select: ['aid'],
    });
    let aids = atoms.map(atom => atom.aid);
    if (traits.length === 1) {
      return aids;
    }
    for await (const entity of traits.slice(1)) {
      const ids = await this.manager.find<Trait>(entity, {
        select: ['aid'],
        where: { aid: In(aids) },
      });
      aids = ids.map(id => id.aid);
    }
    return aids;
  }
}
