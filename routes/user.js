var express = require('express');
var router = express.Router();
var user = require('../functions/user.js');
var createError = require('http-errors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {

  console.log(req.body);

  if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('username')) {
    console.log(req.body);
    next(createError(400));
  }

  //Set gid from request 0: admin, 1: user, 2: guest
  gid = 1;
  if (req.body.hasOwnProperty('gid') && req.body.gid == 2) {
    gid = 2;
  }

  user.create(req.body.username, req.body.email, req.body.password, gid)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      next(createError(400));
    });
});

module.exports = router;