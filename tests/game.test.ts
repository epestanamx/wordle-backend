import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/database';
import { UserEntity } from '../src/database/entities/UserEntity';
import { WordEntity } from '../src/database/entities/WordEntity';

const getToken = async (email: string, password: string) => {
  const response = await request(app).post('/login').send({ email, password });

  return Promise.resolve(response.body.token);
};

const setWord = async (word: string) => {
  await WordEntity.update({ current: true }, {
    current: false,
    available: true,
  });

  return WordEntity.update({ word }, { current: true });
};

const clearUserAttempts = async () => {
  return UserEntity.update({}, { attempts: 0 });
};

describe('Game controller', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  it('GET /games/top/words - Should get list of top words', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const response = await request(app)
      .get('/games/top/words')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
    expect(response.body[0]).toHaveProperty('word');
    expect(response.body[0]).toHaveProperty('total');
  });

  it('GET /games/top/users - Should get list of top users', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const response = await request(app)
      .get('/games/top/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('total');
  });

  it('POST /games/play - Should play game with correct word', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const word = 'royal';
    const userWord = 'royal';

    await setWord(word);
    await clearUserAttempts();

    const response = await request(app)
      .post('/games/play')
      .set('Authorization', `Bearer ${token}`)
      .send({ userWord });

    expect(response.status).toBe(200);
  });

  it('POST /games/play - Should play game with incorrect word', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const word = 'royal';
    const userWord = 'raton';

    await setWord(word);
    await clearUserAttempts();

    const response = await request(app)
      .post('/games/play')
      .set('Authorization', `Bearer ${token}`)
      .send({ userWord });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);
    
    [
      { letter: 'r', value: 1 },
      { letter: 'a', value: 2 },
      { letter: 't', value: 3 },
      { letter: 'o', value: 2 },
      { letter: 'n', value: 3 },
    ].forEach(({ letter, value }, idx) => {
      expect(response.body[idx]).toHaveProperty('letter', letter);
      expect(response.body[idx]).toHaveProperty('value', value);
    });
  });

  it('POST /games/play - Should play game with incorrect length word', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const word = 'royal';
    const userWord = 'roy';

    await setWord(word);
    await clearUserAttempts();

    const response = await request(app)
      .post('/games/play')
      .set('Authorization', `Bearer ${token}`)
      .send({ userWord });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'The word must be 5 characters long');
  });

  it('POST /games/play - Should play game mora attempts', async () => {
    const token = await getToken('demo@demo.com', 'demo123');

    const word = 'royal';
    const userWord = 'raton';
    const userWord2 = 'casco';

    await setWord(word);
    await clearUserAttempts();

    const response = await request(app)
      .post('/games/play')
      .set('Authorization', `Bearer ${token}`)
      .send({ userWord });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);

    const response2 = await request(app)
      .post('/games/play')
      .set('Authorization', `Bearer ${token}`)
      .send({ userWord: userWord2 });

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('message', 'You have reached the maximum number of attempts');
  });
});
