import { Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectDataSource } from '@midwayjs/typeorm';
import { UUIDIntService } from '@wbget/midway-uuid-int';
import { isArray, isString } from 'lodash';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { AtomEntity } from '../entity/ats.entity';
import { Trait } from '../interface';

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

  async delTrait<Entity extends Trait>(trait: EntityTarget<Entity>, id: string);
  async delTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    ids: string[]
  );
  async delTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    id: string | string[]
  ) {
    return this.manager.delete(trait, id);
  }
  async getTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    id: string
  ): Promise<Entity>;
  async getTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    options: FindOneOptions<Entity>
  ): Promise<Entity>;
  async getTrait<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    options: FindOneOptions<Entity> | string
  ): Promise<Entity> {
    if (isString(options)) {
      return this.manager.findOne<Entity>(trait, {
        where: { id: options },
      } as FindOneOptions<Entity>);
    }
    return this.manager.findOne<Entity>(trait, options);
  }

  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>
  ): Promise<Entity[]>;
  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    ids: string[]
  ): Promise<Entity[]>;
  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    options: FindManyOptions<Entity>
  ): Promise<Entity[]>;
  async getTraits<Entity extends Trait>(
    trait: EntityTarget<Entity>,
    options?: FindManyOptions<Entity> | string[]
  ): Promise<Entity[]> {
    if (options === undefined) {
      return this.manager.find(trait);
    }
    if (isArray(options)) {
      return this.manager.find(trait, {
        where: {
          id: In(options),
        } as FindOptionsWhere<Entity>,
      });
    }
    return this.manager.find(trait, options);
  }
  getRepository<Entity>(trait: EntityTarget<Entity>) {
    return this.manager.getRepository(trait);
  }

  getManager() {
    return this.manager;
  }
  /**
   *
   * @param traits 按顺序过滤，传参数时请按照从最细到最宽的顺序传递
   * @returns
   */
  async getAtoms<Entity extends Trait>(
    traits: EntityTarget<Entity>[],
    options: FindOptionsWhere<Entity>[] = null
  ) {
    if (traits.length === 0) {
      return [];
    }
    // TODO 加速查找
    const atoms: Entity[] = await this.manager.find(traits[0], {
      where: options ? options[0] : null,
      select: ['id'],
    });
    let ids = atoms.map(atom => atom.id);
    if (traits.length === 1) {
      return ids;
    }
    const others = traits.slice(1);
    let i = 0;
    for await (const entity of others) {
      if (options) {
        const option = options[i + 1];
        const tids = await this.manager.find<Trait>(entity, {
          select: ['id'],
          where: option ? [{ id: In(ids) }, option] : { id: In(ids) },
        });
        ids = tids.map(id => id.id);
      } else {
        const tids = await this.manager.find<Trait>(entity, {
          select: ['id'],
          where: { id: In(ids) },
        });
        ids = tids.map(id => id.id);
      }
    }
    return ids;
  }
}
