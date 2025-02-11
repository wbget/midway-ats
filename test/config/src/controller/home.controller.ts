import { Controller, Get, Inject, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectDataSource } from '@midwayjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { WithTransaction, ATSService } from '../../../../src/';
import { TestTransaction } from '../entity/test.entity';
import { MockService } from '../service/mock.service';

@Controller('/')
export class HomeController {
  @InjectDataSource()
  dataSource: DataSource;
  @Inject()
  ctx: Context;
  @Inject()
  ats: ATSService;
  @Inject()
  mock: MockService;

  @Get('/')
  async home() {
    this.ctx.body = '';
  }

  @Post('/transaction')
  @WithTransaction()
  async tp(manager: EntityManager) {
    let aid0, aid1: string;
    aid0 = await this.ats.addAtom();
    aid1 = await this.ats.addAtom();
    const t0 = await this.ats.createTrait(TestTransaction, aid0);
    const t1 = await this.ats.createTrait(TestTransaction, aid1);
    await this.ats.saveTrait(t0);
    await this.ats.saveTrait(t1);
    const atoms = await this.ats.getAtoms([TestTransaction]);
    this.ctx.body = atoms.length;
  }
  @Get('/transaction')
  @WithTransaction()
  async transaction(manager: EntityManager) {
    let aid0, aid1: string;
    aid0 = await this.ats.addAtom();
    aid1 = await this.ats.addAtom();
    const t0 = await this.ats.createTrait(TestTransaction, aid0);
    const t1 = await this.ats.createTrait(TestTransaction, aid1);
    await this.ats.saveTrait(t0);
    await this.ats.saveTrait(t1);
    throw new Error('share transaction');
    const atoms = await this.ats.getAtoms([TestTransaction]);
    this.ctx.body = atoms.length;
  }

  @Get('/stop')
  @WithTransaction()
  async stop(manager: EntityManager) {
    let aid0, aid1: string;
    aid0 = await this.ats.addAtom();
    aid1 = await this.ats.addAtom();
    const t0 = await this.ats.createTrait(TestTransaction, aid0);
    const t1 = await this.ats.createTrait(TestTransaction, aid1);
    await this.ats.saveTrait(t0);
    await this.ats.saveTrait(t1);
    await this.mock.stop();
    throw new Error('111');
    const atoms = await this.ats.getAtoms([TestTransaction]);
    this.ctx.body = atoms.length;
  }
}
