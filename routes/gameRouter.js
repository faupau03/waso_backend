var express = require('express');
var router = express.Router();
var db = require('../db.js');
var createError = require('http-errors');

//Get /game get all games from database
router.get('/', async(req, res, next) => {

  try {
    const games = await db.any('SELECT * FROM games');
    res.json(games);
  } 
  catch(e) {
    next(createError(500));
  }
});

//Get /game/:id get a game from database
router.get('/:id', async(req, res, next) => {
  try {
    const game = await db.any('SELECT * FROM games WHERE id=$1', [req.params.id]);
    if (game.length == 1) {
      res.json(game[0]);
    }
    else if (game.length == 0) {
      next(createError(404));
    }
    else {
      next(createError(500));
    }
    
  } 
  catch(e) {
    next(createError(500));
  }
});

//Post /game create a new game in database
router.post('/', async(req, res, next) => {
  try {
    var game_data = new Array();
    console.log(req.body.user.length);
    game_data.push([]);
    game_data.push([]);
    for (let i in req.body.user) {
      console.log(i);
      game_data[0].push(req.body.user[i]);
      game_data[1].push("15");
    }
    const game = await db.any('INSERT INTO games(name, data) VALUES($1, $2) RETURNING *', [req.body.name, JSON.stringify(game_data)]);
    if (game.length == 1) {
      res.json(game[0]);
    }
    else if (game.length == 0) {
      next(createError(404));
    }
    else {
      next(createError(500));
    }
  } 
  catch(e) {
    next(createError(500));
  }
});

//Put /game/:id update a game in database
router.put('/game/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('games');
  collection.update({_id:req.params.id}, req.body, function(err, result){
    res.json({"code":200, "message":"Success", "data":result});
  });
});

//Delete /game/:id delete a game from database
router.delete('/game/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('games');
  collection.remove({_id:req.params.id}, function(err, result){
    res.json({"code":200, "message":"Success", "data":result});
  });
});
module.exports = router;
