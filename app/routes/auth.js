const app = module.exports = require('express')();
const h = require('../utils/controllerHandler');
const c = require('../controllers');

app.post('/register', h(c.register, ({ body }) => [body.user]));
app.post('/login', h(c.login, ({ body }) => [body.user]));
app.post('/verify', h(c.verify, ({ body }) => [body.token]));
app.post('/token-update', h(c.tokenUpdate, ({ body }) => [body.token]));