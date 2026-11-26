
const request = require('supertest');
const app = require('../app');

describe('Category API Integration Test', () => {
  let token;
  let otherToken;

  beforeEach(async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Category User',
        email: 'category@example.com',
        password: 'password123'
      });

    token = userResponse.body.token;

    const otherUserResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Other User',
        email: 'othercategory@example.com',
        password: 'password123'
      });

    otherToken = otherUserResponse.body.token;
  });

  test('Berhasil membuat Category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pekerjaan',
        description: 'Kategori pekerjaan'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.category.name).toBe('Pekerjaan');
  });

  test('Berhasil mengambil daftar Category', async () => {
    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sekolah' });

    const response = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.results).toBe(1);
  });

  test('Berhasil mengambil Category berdasarkan ID', async () => {
    const created = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pribadi' });

    const id = created.body.data.category._id;

    const response = await request(app)
      .get(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.category.name).toBe('Pribadi');
  });

  test('Berhasil mengubah Category', async () => {
    const created = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kategori Lama' });

    const id = created.body.data.category._id;

    const response = await request(app)
      .patch(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kategori Baru' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.category.name).toBe('Kategori Baru');
  });

  test('Berhasil menghapus Category', async () => {
    const created = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kategori Hapus' });

    const id = created.body.data.category._id;

    const response = await request(app)
      .delete(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Category berhasil dihapus');
  });

  test('Pengguna lain tidak bisa mengakses Category', async () => {
    const created = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kategori Rahasia' });

    const id = created.body.data.category._id;

    const response = await request(app)
      .get(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Category tidak ditemukan.');
  });
});
