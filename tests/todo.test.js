
const request = require('supertest');
const app = require('../app');

describe('Todo API Integration Test', () => {
  let token;
  let otherToken;
  let todoId;

  beforeEach(async () => {
    // Membuat akun utama
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Todo User',
        email: 'todo@example.com',
        password: 'password123'
      });

    token = userResponse.body.token;

    // Membuat akun pengguna lain
    const otherUserResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });

    otherToken = otherUserResponse.body.token;
  });

  test('Berhasil membuat Todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Belajar Jest',
        description: 'Membuat integration test',
        priority: 'high'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.todo.title).toBe('Belajar Jest');

    todoId = response.body.data.todo._id;
  });

  test('Berhasil mengambil daftar Todo', async () => {
    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Pertama' });

    const response = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.results).toBe(1);
  });

  test('Berhasil mengambil Todo berdasarkan ID', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Detail' });

    const id = created.body.data.todo._id;

    const response = await request(app)
      .get(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.todo.title).toBe('Todo Detail');
  });

  test('Berhasil mengubah Todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Lama' });

    const id = created.body.data.todo._id;

    const response = await request(app)
      .patch(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Baru', status: 'completed' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.todo.title).toBe('Todo Baru');
    expect(response.body.data.todo.status).toBe('completed');
  });

  test('Berhasil menghapus Todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Hapus' });

    const id = created.body.data.todo._id;

    const response = await request(app)
      .delete(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Todo berhasil dihapus');
  });

  test('Pengguna lain tidak bisa mengakses Todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo Rahasia' });

    const id = created.body.data.todo._id;

    const response = await request(app)
      .get(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Todo tidak ditemukan.');
  });
});
