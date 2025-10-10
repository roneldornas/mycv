import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handles a signup request', () => {
    const email = 'bassod+@a.com';
    const password = '12345';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(email);
      });
  });

  it('should signup as a new user then get the currently logged in user', async () => {
    const email = 'bassod+@a.com';
    const password = '12345';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201);

      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200);

      expect(body.email).toEqual(email);
  });
});
