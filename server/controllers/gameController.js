const db = require('../models/config')
const Game = require('../models/game')

module.exports = {
//Create a new game
  createGame: (req, res, next) => {
    var newGame = new Game ({
      name: req.body.name,
      pins: req.body.pins,
      users: [req.tokenPayload._id]
    })
    newGame.save((err, game) => {
    if (err) {
      console.log(`Error in creating game: ${err}`);
      res.status(400).end();
    } else {
      console.log(`Game created: ${game}`);
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
//Get one game from the db
  getOneGame: (req, res, next) => {
    Game.find({_id: req.params.gameid}, (err, game) => {
      if (err) {
        console.log(`Error in finding game: ${err}`);
        res.send(err);
      } else {
        console.log(`Game found: ${game}`);
        res.send(game);
      }
    })
  },

  joinGame: (req, res, next) => {
    Game.update({_id: req.params.gameid}, { $addToSet: { users: req.tokenPayload._id }}).then(game =>{
      console.log('donzo:', game)
    })
  }

};
