var express = require('express');
var router = express.Router();
var db = require('../db.js');
var createError = require('http-errors');

//Get /game get all games from database
router.get('/', async(req, res, next) => {

  try {
    const games = await db.any('SELECT * FROM games');
    console.log(games);
    for (let l = 0; l < games.length; l++) {
      const user = await db.any('SELECT user_id, status, data FROM user_games WHERE game_id=$1', [games[l].id]);
      console.log(user);
      if (games.length >= 1 && user.length >= 1) {
        var data_json = {};
        for (let i = 0; i < user.length; i++) {
          console.log(i);
          data_json[user[i].user_id] = user[i].data;
        }
        games[l].data = data_json;
        
      }
      else if (games[l].length <= 0) {
        next(createError(404));
      }
      else {
        next(createError(500));
      }
    }
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
    console.log(req.params.id);
    const user = await db.any('SELECT user_id, status, data FROM user_games WHERE game_id=$1', [req.params.id]);
    console.log(user);
    if (game.length >= 1 && user.length >= 1) {
      var data_json = {};
      for (let i = 0; i < user.length; i++) {
        console.log(i);
        data_json[user[i].user_id] = user[i].data;
      }

      game[0].data = data_json;
      res.json(game[0]);
    }
    else if (game.length <= 0) {
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

//Post /game create a new game in database
router.post('/', async(req, res, next) => {
  try {

    if (!req.body.hasOwnProperty('user') || (req.body.user.length <= 1) || req.body.hasOwnProperty('name') || req.body.hasOwnProperty('money')) {
      next(createError(400));
    }

    const game = await db.any('INSERT INTO games(name,money) VALUES($1,$2) RETURNING id', [req.body.name, req.body.money]);
    console.log(game);
    console.log(req.body.user);
    if (req.body.user.length > 1) {
      for (let i in req.body.user) {
        const user = await db.one('INSERT INTO user_games(game_id,user_id) VALUES($1,$2) RETURNING user_id', [game[0].id, req.body.user[i]]);
      }
      res.json(game[0]);
    }
    else {
      const remove = await db.any('DELETE FROM games WHERE id=$1', [game[0].id]);
      next(createError(400))
    }

  } 
  catch(e) {
    next(createError(500));
  }
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

//Put /game/:id update a game in database
router.put('/:id', async(req, res, next) => {
  console.log(req.params.id);
  console.log(req.body.id);
  console.log(req.body.data);

  if ((!req.body.hasOwnProperty('id') && !req.params.id) || !req.body.hasOwnProperty('data')) {
    next(createError(400));
  }
  try {
    
    //if one of the arrays ends with 0, finished is true
    var finished = false;
    for (let i in req.body.data) {
      if (req.body.data[i][req.body.data[i].length - 1] == "0") {
        finished = true;
      }
    }

    const game = await db.any('UPDATE games SET money=$1, updated=$2, finished=$3 WHERE id = $4', [req.body.money, new Date, finished, req.body.id]);
    console.log(game);
    console.log(req.body.user);
    const user = await db.any('SELECT user_id FROM user_games WHERE game_id=$1', [req.body.id]);
    console.log(user);
    if (user.length > 1) {
      for (let i in user) {
        const one_user = await db.one('INSERT INTO user_games(game_id,user_id,data) VALUES($1,$2) RETURNING user_id', [game[0].id, user[i], req.body.data[user[i]]]);
      }
      res.json(game[0]);
    }
    else {
      const remove = await db.any('DELETE FROM games WHERE id=$1', [game[0].id]);
      next(createError(400))
    }

  } 
  catch(e) {
    next(createError(500));
  }
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
