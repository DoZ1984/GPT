const request = require('supertest');
const fs = require('fs');
let app;

beforeAll(() => {
  if (fs.existsSync('database.db')) fs.unlinkSync('database.db');
  app = require('../server');
});

test('register and login user', async () => {
  const agent = request.agent(app);
  await agent
    .post('/register')
    .send('username=test&password=pass')
    .expect(302);
  const res = await agent
    .post('/login')
    .send('username=test&password=pass');
  expect(res.status).toBe(302);

  await agent
    .post('/score')
    .send({ time: 5, mode: 'single' })
    .expect(200);

  await agent
    .post('/score')
    .send({ time: 6, mode: 'multi' })
    .expect(200);

  const scorePage = await agent.get('/scores');
  expect(scorePage.text).toContain('test');

  const singlePage = await agent.get('/scores?mode=single');
  expect(singlePage.text).toContain('single');
  expect(singlePage.text).not.toMatch(/<td>multi<\/td>/);

  const textRes = await agent.get('/text');
  expect(textRes.status).toBe(200);
  expect(textRes.text.length).toBeGreaterThan(0);
});
