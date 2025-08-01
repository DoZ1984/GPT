const request = require('supertest');
const fs = require('fs');
let app;

beforeAll(() => {
  if (fs.existsSync('database.db')) fs.unlinkSync('database.db');
  app = require('../server');
});

test('register and login user', async () => {
  const agent = request(app);
  await agent
    .post('/register')
    .send('username=test&password=pass')
    .expect(302);
  const res = await agent
    .post('/login')
    .send('username=test&password=pass');
  expect(res.status).toBe(302);
});
