import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database';

describe('Index controller', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  
  it('GET / - Should get status code 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
