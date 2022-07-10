import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database';

const getToken = async (email: string, password: string) => {
  const response = await request(app)
    .post('/login')
    .send({ email, password });

  return Promise.resolve(response.body.token);
};

describe('Auth controller', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  it('POST /login - Should get user session', async () => {
    const response = await request(app).post('/login').send({
      email: 'demo@demo.com',
      password: 'demo123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('attempts');
    expect(response.body).toHaveProperty('token');
  });

  it('POST /login - Should get error when user not found', async () => {
    const response = await request(app).post('/login').send({
      email: 'demo@demo123.com',
      password: 'demo123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User not found');
  });

  it('POST /login - Should get error when password is incorrect', async () => {
    const response = await request(app).post('/login').send({
      email: 'demo@demo.com',
      password: 'demo123123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid password');
  });

  it('POST /register - Should register new user', async () => {
    const response = await request(app).post('/register').send({
      name: 'Demo',
      email:`demo${new Date().getTime()}@demo.com`,
      password: 'demo123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('attempts');
    expect(response.body).toHaveProperty('token');
  });

  it('POST /register - Should get error when user already exists', async () => {
    const response = await request(app).post('/register').send({
      name: 'Demo',
      email: 'demo@demo.com',
      password: 'demo123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User already exists');
  });

  it('GET /profile - Should get user profile', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('attempts');
    expect(response.body).toHaveProperty('statistics');
    expect(response.body.statistics).toHaveProperty('played');
    expect(response.body.statistics).toHaveProperty('won');
    expect(response.body.statistics).toHaveProperty('lost');

  });

  it('GET /profile - Should get error when user is Unauthorized', async () => {
    const response = await request(app).get('/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Unauthorized');
  });
});
