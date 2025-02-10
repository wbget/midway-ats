import { ObjectLiteral } from 'typeorm';

export interface Atom {
  aid: number;
}
export interface Trait extends Atom, ObjectLiteral {}
