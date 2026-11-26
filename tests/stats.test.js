
const request = require('supertest');
const app = require('../app');

describe('Stats API Integration Test', () => {
  const apiKey = 'secret-api-key-testing';

  beforeAll(() => {
    process.env.API_KEY = apiKey;
  });

  test('Berhasil mengambil statistik dengan API Key valid', async () => {
    const response = await request(app)
      .get('/api/stats/summary')
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Statistik berhasil diambil');
  });

  test('Gagal mengambil statistik dengan API Key salah', async () => {
    const response = await request(app)
      .get('/api/stats/summary')
      .set('x-api-key', 'api-key-salah');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      'API Key tidak valid atau tidak tersedia'
    );
  });

  test('Gagal mengambil statistik tanpa API Key', async () => {
    const response = await request(app)
      .get('/api/stats/summary');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      'API Key tidak valid atau tidak tersedia'
    );
  });

  test('Statistik menampilkan jumlah Todo dan Category yang benar', async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Stats User',
        email: 'stats@example.com',
        password: 'password123'
      });

    const token = userResponse.body.token;

    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Pending', status: 'pending' });

    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Progress', status: 'in_progress' });

    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Completed', status: 'completed' });

    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pekerjaan' });

    const response = await request(app)
      .get('/api/stats/summary')
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual({
      totalTodos: 3,
      pendingTodos: 1,
      inProgressTodos: 1,
      completedTodos: 1,
      totalCategories: 1
    });
  });
});
