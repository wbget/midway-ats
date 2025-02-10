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
  // it('test request /noGuard', async () => {
  //   const res = await createHttpRequest(app).get('/noGuard');
  //   expect(res.status).toBe(403);
  // });
  it('test atom', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const aid = await service.addAtom();
    expect(aid !== null);
    await service.delAtom(aid);
  });
  it('tset trait', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const aid = await service.addAtom();
    const trait = await service.createTrait(TestTrait0, aid);
    expect(trait.aid).toBe(aid);
    const t0 = await service.getTrait(TestTrait0, trait.aid);
    expect(t0 === null);
    await service.saveTrait(trait);
    const t1 = await service.getTrait(TestTrait0, trait.aid);
    await service.delTrait(TestTrait0, t1!.aid);
    await service.delAtom(aid);
  });
  it('test getAtoms', async () => {
    const service = await app
      .getApplicationContext()
      .getAsync(custom.ATSService);
    const aid0 = await service.addAtom();
    const aid1 = await service.addAtom();
    const aid2 = await service.addAtom();
    const t00 = await service.createTrait(TestTrait0, aid0);
    await service.saveTrait(t00);
    const t01 = await service.createTrait(TestTrait0, aid1);
    await service.saveTrait(t01);
    const t11 = await service.createTrait(TestTrait1, aid1);
    await service.saveTrait(t11);
    const t12 = await service.createTrait(TestTrait1, aid2);
    await service.saveTrait(t12);
    const aids0 = await service.getAtoms([TestTrait0]);
    expect(aids0).toEqual([aid0, aid1]);
    const aids1 = await service.getAtoms([TestTrait1]);
    expect(aids1).toEqual([aid1, aid2]);
    const aids2 = await service.getAtoms([TestTrait0, TestTrait1]);
    expect(aids2).toEqual([aid1]);
  });
});
