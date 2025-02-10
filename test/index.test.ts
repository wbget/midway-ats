import { Application, Framework } from '@midwayjs/koa';
import { close, createApp, createHttpRequest } from '@midwayjs/mock';
import { join } from 'path';
import * as custom from '../src';
import { MockService } from './config/src/service/mock.service';

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
    expect(aid).toBeGreaterThan(0);
    await service.delAtom(aid);
  });
});
