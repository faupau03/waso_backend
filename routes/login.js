var express = require('express');
var router = express.Router({
  mergeParams: true
});

var createError = require('http-errors');
var login = require('../functions/login.js');

router.post('/', async (req, res, next) => {

  //  Check if name and user are given
  if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
    console.log('Missing email or password');
    next(createError(400));
  }

  //  Run create function
  login.login(req.body.email, req.body.password)
    .then(function (result) {
      if (result) {
        req.session.uid = result.id;
        req.session.gid = result.gid;
        console.log('User logged in');
        res.json({
          id: req.session.id,
          uid: result.id,
          gid: result.gid
        });
      }
      else {
        console.log('Wrong email or password');
        next(createError(401));
      }
      
    })
    .catch(function (e) {
      if (e.message == "400") {
        next(createError(400));
      } 
      else {
        console.log(e);
        next(createError(500));
      }
    });
});

router.get('/', async (req, res, next) => {
  if (req.session.uid) {
    res.json({
      id: req.session.id,
      uid: req.session.uid,
      gid: req.session.gid
      });
  }
  else {
    next(createError(401));
  }
});

router.delete('/', async (req, res, next) => {
  if (req.session.uid) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        next(createError(500));
      }
      else {
        res.json({
          id: null
        });
      }
    });
  }
  else {
    next(createError(401));
  }
});



module.exports = router;
