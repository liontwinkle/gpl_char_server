const app = module.exports = require('express')();

app.use('/auth', require('./auth'));

app.get('*', (req, res) => res.sendStatus(404));