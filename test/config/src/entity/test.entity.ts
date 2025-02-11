import { Column, Entity } from 'typeorm';
import { TraitEntity } from '../../../../src';

@Entity()
export class TestTrait0 extends TraitEntity {
  @Column({ nullable: true })
  tt: string;
}
@Entity()
export class TestTrait1 {
  @Column({ type: 'bigint', primary: true })
  aid: string;
  @Column({ nullable: true })
  ff: string;
}

@Entity()
export class TestTransaction {
  @Column({ type: 'bigint', primary: true })
  aid: string;
}
