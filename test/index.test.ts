import { Application, Framework } from '@midwayjs/koa';
import { close, createApp, createHttpRequest } from '@midwayjs/mock';
import { join } from 'path';
import * as custom from '../src';
import { MockService } from './config/src/service/mock.service';
import { TestTrait0, TestTrait1 } from './config/src/entity/test.entity';

describe('/test/index.test.ts', () => {
  let app: Application;
  beforeAll(async () => {
    app = await createApp<Framework>(join(__dirname, './config'));
  });
  beforeEach(async () => {
    const service = await app.getApplicationContext().getAsync(MockService);
    await service.clear();
  });
  afterAll(async () => {
    await close(app);
  });
  it('test request /', async () => {
    const res = await createHttpRequest(app).get('/');
    expect(res.status).toBe(200);
  });
  it('test atom', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const id = await service.addAtom();
    expect(id).toBeDefined();
    await service.delAtom(id);
  });
  it('tset trait', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const id = await service.addAtom();
    const trait = await service.createTrait(TestTrait0, id);
    expect(trait.id).toBe(id);
    const t0 = await service.getTrait(TestTrait0, trait.id);
    expect(t0).toBeNull();
    await service.saveTrait(trait);
    const t1 = await service.getTrait(TestTrait0, trait.id);
    await service.delTrait(TestTrait0, t1!.id);
    await service.delAtom(id);
  });
  it('test getAtoms', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const id0 = await service.addAtom();
    const id1 = await service.addAtom();
    const id2 = await service.addAtom();
    const t00 = await service.createTrait(TestTrait0, id0);
    await service.saveTrait(t00);
    const t01 = await service.createTrait(TestTrait0, id1);
    await service.saveTrait(t01);
    const t11 = await service.createTrait(TestTrait1, id1);
    await service.saveTrait(t11);
    const t12 = await service.createTrait(TestTrait1, id2);
    await service.saveTrait(t12);
    const ids0 = await service.getAtoms([TestTrait0]);
    expect(ids0).toEqual([id0, id1]);
    const ids1 = await service.getAtoms([TestTrait1]);
    expect(ids1).toEqual([id1, id2]);
    const ids2 = await service.getAtoms([TestTrait0, TestTrait1]);
    expect(ids2).toEqual([id1]);
  });
  it('test transaction service', async () => {
    const res = await createHttpRequest(app).post('/transaction');
    expect(res.body).toBe(2);
  });
  it('test transaction one service', async () => {
    await createHttpRequest(app).get('/transaction');
  });
  it('test transaction many service', async () => {
    const res = await createHttpRequest(app).get('/stop');
    expect(res.body).toBe(2);
  });
});
