const express = require('express');
const routes = express.Router();

const acounts = require('./acounts');

routes.use(acounts);

module.exports = routes;