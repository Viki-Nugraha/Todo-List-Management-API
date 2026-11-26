
const request = require('supertest');
const app = require('../app');

describe('Auth API Integration Test', () => {
  describe('POST /api/auth/register', () => {
    test('Berhasil register dengan data valid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    test('Gagal register dengan email yang sudah terdaftar', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email sudah terdaftar');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login User',
          email: 'login@example.com',
          password: 'password123'
        });
    });

    test('Berhasil login dengan data benar', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test('Gagal login dengan password salah', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'passwordsalah'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Email atau password salah');
    });
  });
});
