const express = require('express');

const { getCategories } = require('./controllers/categories.controllers');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

module.exports = app;
