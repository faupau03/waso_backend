var express = require('express');
var router = express.Router({
  mergeParams: true
});

var createError = require('http-errors');
var login = require('../functions/login.js');

// POST request to login
router.post('/', async (req, res, next) => {
  // Check if the request contains the required fields
  if (!Object.prototype.hasOwnProperty.call(req.body, 'email') || !Object.prototype.hasOwnProperty.call(req.body, 'password')) {
    console.log('Missing email or password');
    return next(createError(400));
  }

  // Run login function
  login.login(req.body.email, req.body.password)
    .then(result => {
      if (result) {
        req.session.uid = result.id;
        req.session.gid = result.gid;
        console.log('User logged in');
        // Send the session data in JSON format
        res.json({
          id: req.session.id,
          uid: req.session.uid,
          gid: req.session.gid
        });
      }
      else {
        console.log('Wrong email or password');
        next(createError(401));
      }
    })
    .catch(e => {
      if (e.message === "400") {
        next(createError(400));
      } else {
        console.log(e);
        next(createError(500));
      }
    });
});

// GET request to check if user is logged
router.get('/', async (req, res, next) => {
  if (req.session.uid) {
    // Send the session data in JSON format
    res.json({
      id: req.session.id,
      uid: req.session.uid,
      gid: req.session.gid
    });
  } else {
    next(createError(401));
  }
});

// DELETE request to logout
router.delete('/', async (req, res, next) => {
  if (req.session.uid) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        next(createError(500));
      } else {
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
