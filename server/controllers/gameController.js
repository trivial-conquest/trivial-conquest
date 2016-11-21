const db = require('../models/config')
const Game = require('../models/game')

module.exports = {
//Create a new game
  createGame: (req, res, next) => {
    var newGame = new Game ({
      name: req.body.name,
      pins: req.body.pins,
      users: [req.tokenPayload],
      scoreboard: [{
          user: req.tokenPayload._id
      }],
      limit: Number(req.body.limit)
    })
    newGame.save((err, game) => {
    if (err) {
      console.log(`Error in creating game: ${err}`);
      res.status(400).end();
    } else {
      console.log(`Game created: ${game}`);
      console.log('lets see if this works length', game.users.length, 'limit', game.limit)
      Game.update({_id: game._id}, { $set: { remain: game.limit - game.users.length }}).then(game =>{
      console.log('works:', game)
    })
      res.send(game);
    }
    })
    .catch(function(err){
      console.log('this is a creategame error', err)
  })
},
//Get all games in the db
  getAllGames: (req, res, next) => {
    Game.find({}, {}, {sort:{'createdAt':-1}}, (err, games) => {
      if (err) {
        console.log(`Find all games error: ${err}`); //The '$' signifies a JS variable
        res.send(err);
      } else {
        res.send(games);
      }
    })
  },
//Gets a specific game
  getOneGame: (req, res, next) => {
    console.log('Game ID', req.params.gameid)
    Game.find({_id: req.params.gameid}, (err, game) => {
      if (err) {
        console.log(`Error in finding game: ${err}`);
        res.send(err);
      } else {
        res.send(game);
      }
    })
  },

//Gets a players current point total for a game
  getPlayerPoints: (req, res, next) => {
    Game.find({_id: req.params.gameid}, (err, game) => {
      if (err) {
        console.log(`Error in getting points: ${err}`);
        res.send(err);
      } else {
        console.log('FOUND GAME FOR POINTS', game[0])
        console.log(game[0].user)
        var userStats = game[0].scoreboard.filter(function(board){
          return board.user == req.tokenPayload._id
        })
        res.send(userStats);
      }
    })
  },

//Allows a user to join a game
  joinGame: (req, res, next) => {
    Game.findOne({_id: req.params.gameid}, (err, game) => {
      var alreadyJoined = false;
      game.users.forEach((user) => {
        if(user._id == req.tokenPayload._id) alreadyJoined = true;
      })
      if(!alreadyJoined) {
        if (game.remain > 0) {
          Game.update({_id: req.params.gameid},
            {$inc: {remain: -1}, $addToSet: { users: req.tokenPayload, "scoreboard": {user: req.tokenPayload._id}}}, (err, mod) => {
              next()
            })
        } else {
          console.log('SORRY MATE: GAME IS FULL')
          next()
        }
      } else {
        res.send('You already joined this game')
      }
    })

  },

  setWinner : (req, res, next) => {
    var winner = req.body.winner
    Game.findOneAndUpdate({_id: req.params.gameid}, { $set: { winner: winner}}, {new: true}, (err,game) => {
      if(err) {
        console.log(`Error in setting winner: ${err}`);
        res.send(err);
      } else {
        console.log('GAME FROM SET WINNER', game)
        res.send(game)
      }
    })
  }

};
