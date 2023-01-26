var express = require('express');
var router = express.Router();
var user = require('../functions/user.js');
var createError = require('http-errors');

// GET request to get all users.
router.get('/', function (req, res, next) {
  // Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
    return;
  }
  user.get()
    .then(function (users) {
      // Send the users data in JSON format
      res.json(users);
    })
    .catch(function (err) {
      // Handle any errors that occur
      next(createError(404, err));
    });
});

// GET request to get a user by id
router.get('/:id', function (req, res, next) {
  // Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
    return;
  }

  user.get(req.params.id)
    .then(function (user) {
      // Send the user data in JSON format
      res.json(user);
    })
    .catch(function (err) {
      // Handle any errors that occur
      next(createError(404, err));
    });
});

// POST request to create a new user
router.post('/', async (req, res, next) => {
  // Check if the request contains the required fields
  if (!Object.prototype.hasOwnProperty.call(req.body, 'email') || !Object.prototype.hasOwnProperty.call(req.body, 'password') || !Object.prototype.hasOwnProperty.call(req.body, 'username')) {
    // If the request is missing required fields, return a 400 error
    next(createError(400));
    return;
  }

  // Set the gid (user group id) from the request
  // 0: admin, 1: user, 2: guest
  let gid = 1;
  if (Object.prototype.hasOwnProperty.call(req.body, 'gid') && req.body.gid == 2) {
    // Create guest account
    // Check if user is logged in
    if (!req.session.uid) {
      next(createError(401, 'Unauthenticated'));
      return;
    }
    gid = 2;
  }

  // Call the user.create function to create the new user
  user.create(req.body.username, req.body.email, req.body.password, gid)
    .then(result => {
      // Send a success status and the result data in JSON format
      res.status(200).json(result);
    })
    .catch(err => {
      // Handle any errors that occur
      console.log(err);
      next(createError(400));
    });
});

module.exports = router;
