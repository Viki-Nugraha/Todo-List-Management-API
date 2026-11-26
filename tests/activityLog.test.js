
const request = require('supertest');
const app = require('../app');

describe('Activity Log API Integration Test', () => {
  let token;

  beforeEach(async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Activity User',
        email: 'activity@example.com',
        password: 'password123'
      });

    token = userResponse.body.token;
  });

  test('Berhasil mengambil daftar Activity Log', async () => {
    const response = await request(app)
      .get('/api/activity-logs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.results).toBe(0);
    expect(response.body.data.logs).toEqual([]);
  });

  test('Activity Log tercatat setelah Todo dibuat', async () => {
    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Activity' });

    const response = await request(app)
      .get('/api/activity-logs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.results).toBe(1);
    expect(response.body.data.logs[0].action).toBe('create');
    expect(response.body.data.logs[0].resource).toBe('Todo');
  });

  test('Activity Log tercatat setelah Todo diperbarui', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Lama' });

    const id = created.body.data.todo._id;

    await request(app)
      .patch(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Baru' });

    const response = await request(app)
      .get('/api/activity-logs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.results).toBe(2);
    expect(response.body.data.logs[0].action).toBe('update');
    expect(response.body.data.logs[1].action).toBe('create');
  });

  test('Activity Log tercatat setelah Todo dihapus', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Hapus' });

    const id = created.body.data.todo._id;

    await request(app)
      .delete(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/api/activity-logs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.results).toBe(2);
    expect(response.body.data.logs[0].action).toBe('delete');
    expect(response.body.data.logs[1].action).toBe('create');
  });

  test('Tidak bisa mengambil Activity Log tanpa login', async () => {
    const response = await request(app)
      .get('/api/activity-logs');

    expect(response.statusCode).toBe(401);
  });
});
