import { Entity, PrimaryColumn } from 'typeorm';
import { Atom, Trait } from '../interface';

@Entity()
export class AtomEntity implements Atom {
  @PrimaryColumn()
  aid: number;
}

export abstract class TraitEntity implements Trait {
  @PrimaryColumn()
  aid: number;
}
