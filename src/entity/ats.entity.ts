import { Entity, PrimaryColumn } from 'typeorm';
import { Atom, Trait } from '../interface';

@Entity({
  name: 'atom',
})
export class AtomEntity implements Atom {
  @PrimaryColumn({ type: 'bigint' })
  aid: number;
}

export abstract class TraitEntity implements Trait {
  @PrimaryColumn()
  aid: number;
}
