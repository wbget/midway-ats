import { ObjectLiteral } from 'typeorm';

export interface Atom {
  aid: string;
}
export interface Trait extends Atom, ObjectLiteral {}
