// Integration tests for API routes
// Note: These tests require MongoDB to be running
// For CI/CD, consider using mongodb-memory-server for isolated testing

const fs = require('fs');
const path = require('path');

describe('Routes Module', () => {
  it('should export express router', () => {
    const reports = require('./reports');
    expect(reports).toBeDefined();
    expect(typeof reports).toBe('function'); // Express router is a function
  });

  it('should have sample XML files available', () => {
    const sample1 = path.join(__dirname, '../../samples/sample1.xml');
    const sample2 = path.join(__dirname, '../../samples/sample2.xml');
    
    expect(fs.existsSync(sample1)).toBe(true);
    expect(fs.existsSync(sample2)).toBe(true);
  });
});

// For full integration tests with MongoDB, uncomment and use:
/*
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('API Integration Tests (with MongoDB)', () => {
  let mongoServer;
  let app;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = require('../index');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('POST /api/upload - should upload XML file', async () => {
    const xmlPath = path.join(__dirname, '../../samples/sample1.xml');
    const res = await request(app)
      .post('/api/upload')
      .attach('file', xmlPath);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  test('GET /api/reports - should return reports list', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
*/
