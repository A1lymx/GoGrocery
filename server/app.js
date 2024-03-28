const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/api', apiRouter);

module.exports = app;
