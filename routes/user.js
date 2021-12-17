var express = require('express');
var router = express.Router();
var user = require('../functions/user.js');
var createError = require('http-errors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  user.get()
  .then(function(user) {
    res.json(user);
  })
  .catch(function(err) {
    next(createError(404, err));
  });
});

router.get('/:id', function(req, res, next) {
  user.get(req.params.id)
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      next(createError(404, err));
    });
});


router.post('/', async (req, res, next) => {

  console.log(req.body);

  if ((!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('username')) && (req.body.gid != 2)) {
    console.log(req.body);
    next(createError(400));
  }

  //Set gid from request 0: admin, 1: user, 2: guest
  gid = 1;
  if (req.body.hasOwnProperty('gid') && req.body.gid == 2) {
    gid = 2;
    req.body.password = "guest";
    req.body.email = "guest";
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
