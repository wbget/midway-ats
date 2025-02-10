import { Init, Inject, Provide } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { UUIDIntService } from '@wbget/midway-uuid-int';
import { DataSource, EntityManager, EntityTarget, In } from 'typeorm';
import { Atom, Trait } from '../interface';
import { AtomEntity } from '../entity/ats.entity';

@Provide()
export class ATSService {
  @InjectDataSource()
  private dataSource: DataSource;
  @Inject()
  private uuid: UUIDIntService;
  private manager: EntityManager;

  @Init()
  async init() {
    this.manager = this.dataSource.manager;
  }
  async addAtom() {
    const atom = this.manager.create(AtomEntity);
    atom.aid = this.uuid.uuid();
    await this.manager.save(atom);
    return atom.aid;
  }
  async delAtom(aid: number) {
    await this.manager.delete(AtomEntity, { aid });
  }
  async createTrait<Entity extends Trait>(
    aid: number,
    trait: EntityTarget<Entity>
  ) {
    const entity = await this.manager.create(trait);
    entity.aid = aid;
    return entity;
  }
  async saveTrait<Entity extends Trait>(trait: Entity) {
    await this.manager.save(trait);
  }
  async delTrait<Entity extends Trait>(
    aid: number,
    trait: EntityTarget<Entity>
  ) {
    await this.manager.delete(trait, { aid });
  }
  async getTrait<Entity extends Trait>(
    aid: number,
    trait: EntityTarget<Entity>
  ) {
    return this.manager.findOne<Atom>(trait, { where: { aid } });
  }
  async getTraits<Entity extends Trait>(trait: EntityTarget<Entity>) {
    return this.manager.find(trait);
  }

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
      const ids = await this.manager.find<Atom>(entity, {
        select: ['aid'],
        where: { aid: In(aids) },
      });
      aids = ids.map(id => id.aid);
    }
    return aids;
  }
}
