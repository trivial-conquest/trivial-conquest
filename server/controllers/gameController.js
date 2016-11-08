const db = require('../models/config')
const Game = require('../models/game')

module.exports = {
//Create a new game
  createGame: (req, res, next) => {
    console.log('GETTING IT IN: ', req.tokenPayload)
    var newGame = new Game ({
      name: req.body.name,
      pins: req.body.pins,
      users: [req.tokenPayload._id]
    })
    newGame.save((err, game) => {
    if (err) {
      console.log(`Error in creating game: ${err}`);
      res.send(err);
    } else {
      console.log(`Game created: ${game}`);
      res.send(game);
    }
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

//   addPlayer: (req, res, next) => {
//     Game.findOneAndUpdate({_id: req.params.gameid}, { $push: { users: req.body.user } }, {new:true},
//     (err, game) => {
//       if (err) {
//         console.log(`Error in adding user: ${err}`);
//         res.send(err);
//       } else {
//         console.log(`User added: ${game}`);
//         res.send(game);
//     }
//   })
// }





};
