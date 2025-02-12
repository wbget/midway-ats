import { ObjectLiteral } from 'typeorm';

export interface Atom {
  id: string;
}
export interface Trait extends Atom, ObjectLiteral {}
