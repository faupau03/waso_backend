var express = require('express');
var router = express.Router({
  mergeParams: true
});
var db = require('../db.js');
var createError = require('http-errors');
var game = require('../functions/game.js');

//Get /game get all games from database
router.get('/', async (req, res, next) => {

  //  Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
  }

  game.read()
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      if (e.message == '404') {
        next(createError(404));
      }
      else if (e.message == '400') {
        next(createError(400));
      }
      else {
        next(createError(500, e.message));
      }
    });
});

//Get /game/:id get a game from database
router.get('/:id', async (req, res, next) => {

  //  Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
  }

  game.read(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      if (e.message == '404') {
        next(createError(404));
      }
      else if (e.message == '400') {
        next(createError(400));
      }
      else {
        next(createError(500, e.message));
      }
    });
});


/*
  Endpoint to create an game by the given name, user array and optional money parameter.
  Example JSON body:
  {
    "name": "game1",
    "user": [
      "user1",
      "user2"
    ],
    "money": true,  //optional
  }
*/
router.post('/', async (req, res, next) => {

  //  Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
  }

  //  Check if name and user are given
  if (!req.body.hasOwnProperty('user') || (req.body.user.length <= 1) || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('money')) {
    console.log('Missing name or user or money');
    next(createError(400));
  }

  //  Run create function
  game.create(req.body.name, req.body.user, req.body.money)
    .then(function (id) {
      res.location("/game/" + id);
      res.status(201).json(id);
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





/*
  Endpoint to update an game by the given id an data array.
  Example JSON body:
  {
    "id": 1,
    "data": {
      "1": [
        "15",
        "10",
        "5",
        "-",
        "0"
      ]
    },
    "money": true,  //optional
  }
 */
router.put('/:id', function (req, res, next) {

  //  Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
  }

  var finished = false;

  //  Check if id and data is given
  if (
    (!req.body.hasOwnProperty("id") && !req.params.id) || !req.body.hasOwnProperty("data")) {
    console.log("requirements not met!");
    next(createError(400));
  }

  //  Check if any user has won
  for (let i in req.body.data) {
    if (req.body.data[i][req.body.data[i].length - 1] == "0") {
      finished = true;
    }
  }

  //  run update query
  game.update(req.body.id, req.body.data, req.body.money, finished)
    .then(function (result) {
      console.log("after function");
      res.status(200).json(result);
    })
    .catch(function (err) {
      console.log(err);
      if (err.message == "400") {
        next(createError(400));
      } else {
        next(createError(500));
      }
    });
});




//Delete /game/:id delete a game from database
router.delete('/:id', function (req, res, next) {

  //  Check if user is logged in
  if (!req.session.uid) {
    next(createError(401, 'Unauthenticated'));
  }

  //  Check if id is given
  if (req.params.id) {
    //  Run delete function
    game.deleteg(req.params.id)
      .then(function (result) {
        res.status(200).json(result);
      })
      .catch(function (err) {
        if (err.message == "400") {
          next(createError(400));
        } else {
          console.log(err);
          next(createError(500));
        }
      });
  }
  else {
      next(createError(400));
  }
});


module.exports = router;