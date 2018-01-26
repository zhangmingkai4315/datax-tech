const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');

module.exports = (app) => {
  app.use('/', router);
  // app.use('/protect',pas)
};

router.get('/', (req, res) => {
  res.render('index', {title: 'DataX'});
});

router.get('/login', (req, res) => {
  res.render('auth/login', {title: 'login'})
})
