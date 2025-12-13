const request = require('supertest');
const app = require('../index');
const { User, Sweet } = require('../models');

describe('Sweets API', () => {
  let userToken: string;
  let adminToken: string;
  let testSweetId: number;

  beforeAll(async () => {
    // Create test users
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const regularUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'user123',
      role: 'user',
    });

    // Get tokens (simulating login)
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'admin123',
      });

    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'user123',
      });

    adminToken = adminResponse.body.token;
    userToken = userResponse.body.token;
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Clear existing sweets and create test sweets
      await Sweet.destroy({ where: {} });

      // Create test sweets
      const sweet1 = await Sweet.create({
        name: 'Test Sweet 1',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50,
      });

      const sweet2 = await Sweet.create({
        name: 'Test Sweet 2',
        category: 'Candy',
        price: 1.49,
        quantity: 100,
      });

      testSweetId = sweet1.id;
    });

    it('should get all sweets', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('sweets');
      expect(Array.isArray(response.body.sweets)).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'Test Sweet 1' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sweets.length).toBe(1);
      expect(response.body.sweets[0].name).toBe('Test Sweet 1');
    });

    it('should filter sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Chocolate' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sweets.every((s: any) => s.category === 'Chocolate')).toBe(true);
    });

    it('should filter sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 2, maxPrice: 3 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sweets.every((s: any) => s.price >= 2 && s.price <= 3)).toBe(true);
    });
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Chocolate Bar',
          category: 'Chocolate',
          price: 3.99,
          quantity: 25,
          description: 'Delicious milk chocolate bar',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.sweet.name).toBe('New Chocolate Bar');
      expect(response.body.sweet.price).toBe(3.99);
    });

    it('should not create sweet without admin token', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`) // Regular user token
        .send({
          name: 'Unauthorized Sweet',
          category: 'Candy',
          price: 1.99,
          quantity: 10,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });

    it('should not create sweet with invalid data', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          name: 'Invalid Sweet',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/sweets/:id (Admin only)', () => {
    let sweetId: number;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Update',
        category: 'Candy',
        price: 1.99,
        quantity: 50,
      });
      sweetId = sweet.id;
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Sweet Name',
          price: 2.49,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sweet.name).toBe('Updated Sweet Name');
      expect(response.body.sweet.price).toBe(2.49);
    });

    it('should not update sweet without admin token', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Update',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/sweets/:id (Admin only)', () => {
    let sweetId: number;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Delete',
        category: 'Candy',
        price: 1.99,
        quantity: 50,
      });
      sweetId = sweet.id;
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify sweet is deleted
      const deletedSweet = await Sweet.findByPk(sweetId);
      expect(deletedSweet).toBeNull();
    });

    it('should not delete sweet without admin token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: number;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Purchase',
        category: 'Chocolate',
        price: 2.99,
        quantity: 10,
      });
      sweetId = sweet.id;
    });

    it('should purchase sweet with valid token', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.purchasedQuantity).toBe(2);
      expect(response.body.sweet.quantity).toBe(8); // 10 - 2
    });

    it('should not purchase without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 2 });

      expect(response.status).toBe(401);
    });

    it('should not purchase more than available quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 }); // More than available

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient stock');
    });
  });

  describe('POST /api/sweets/:id/restock (Admin only)', () => {
    let sweetId: number;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Restock',
        category: 'Candy',
        price: 1.49,
        quantity: 5,
      });
      sweetId = sweet.id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.restockedQuantity).toBe(10);
      expect(response.body.sweet.quantity).toBe(15); // 5 + 10
    });

    it('should not restock without admin token', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(403);
    });
  });
});