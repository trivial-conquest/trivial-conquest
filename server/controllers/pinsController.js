const db = require('../models/config')
const Pin = require('../models/pin')
const Game = require('../models/game')

module.exports = {
  createNewPin: (req, res) => {
    var insufficientFunds = false
    //First checking to see how many pins user has already created
    Game.findOne({_id: req.params.gameid}, (err, game) => {
      game.scoreboard.forEach((score) => {
        if(score.user == req.tokenPayload._id) {
          if(req.body.points > score.points) insufficientFunds = true
        }
      })
      if(insufficientFunds) return res.send('Sorry dude- not enough points')
      Pin.find({game: req.params.gameid})
      .then((pins) => {
        var userPins = pins.filter(function(pin){
          return pin.creator.toString() == req.tokenPayload._id
        })
        //If the user has created 3 pins already, throw an error
        if(userPins.length >= 3) {
          return res.send('Sorry dude- 3 pins already')
        }
        Pin.find({game: req.params.gameid, address: req.body.address}).then(repeats => {
          if(repeats.length > 0){
            res.status(500).send('Sorry mate- that pin already exists')
          } else {
            //Otherwise, add a new pin
            new Pin({
              address: req.body.address,
              name: req.body.name,
              points: req.body.points,
              coordinates: req.body.coordinates,
              owner: req.tokenPayload._id,
              creator: req.tokenPayload._id,
              game: req.params.gameid,
              icon: req.tokenPayload.profilePicture
            }).save()
            .then((pin) => {
              console.log('successfully created pin: ', pin)
              game.scoreboard.forEach((score) => {
                if(score.user == req.tokenPayload._id) {
                  score.pins.push(pin._id)
                  score.points -= req.body.points
                }
              })
              game.save().then(() => {
                res.send(pin)
              })
            })
            .catch((err) => {
              console.log('ERROR: ', err)
              res.status(500).send('Pin limit reached')
            })
          }
        })
      })
    })
  },

  deletePin: (req, res) => {
    Pin.find({_id: req.params.pinId}).remove()
    .then((pin) => {
      res.send(pin)
      // res.redirect('/')
    })
    .catch((err) => {
      console.log('ERROR: ', err)
    })
  },

  getPinsForGame: (req, res) => {
    Pin.find({game : req.params.gameid})
    .then((pins) => {
      res.send(pins)
    })
    .catch((err) =>{
      console.log('ERROR', err)
    })
  },

 getOnePin: (req, res) => {
    Pin.findOne({_id: req.params.pinId}, (err, pin) => {
      if (err) {
        console.log(`Error in finding game: ${err}`);
        res.send(err);
      } else {
        res.send(pin);
      }
    })
  },

  updatePinOwner: (req, res) => {
    Pin.findOneAndUpdate({_id: req.params.pinId}, {owner: req.tokenPayload._id, icon: req.tokenPayload.profilePicture}, {new: true}, function(err, pin){
        if (err) return res.send(500, { error: err });
        return res.send(pin);
    });
  },

  withdrawal: (req, res) => {
    Pin.findOne({_id: req.params.pinId}, (err, pin) => {
      if(pin.points > req.body.points) {
        var newPointAmount = pin.points - req.body.points;
        pin.points = newPointAmount
        pin.save().then(() => {
          Game.findOne({_id: req.params.gameid}, (err, game) => {
            game.scoreboard.forEach(score => {
              if(score.user == req.tokenPayload._id) {
                score.points += req.body.points
              }
            })
            game.save().then(() => {
              console.log(req.tokenPayload.firstName + " has withdrawn " + req.body.points.toString())
              res.send(pin)
            })
          })
        })
      } else {
        res.send('Sorry mate- this pin does not have that many points')
      }
    })
  },

  deposit: (req, res) => {
    var sufficientFunds = false
    Game.findOne({_id: req.params.gameid}, (err, game) => {
      game.scoreboard.forEach(score => {
        if(score.user == req.tokenPayload._id) {
          if(score.points >= req.body.points) { // if user has as many points as they are trying to deposit
            score.points -= req.body.points // deduct that many points from that user
            sufficientFunds = true
          }
        }
      })
      if(sufficientFunds) {
        game.save().then(() => {  // save the game
          Pin.findOne({_id: req.params.pinId}, (err, pin) => {
            pin.points += req.body.points
            pin.save().then(() => {
              res.send(pin)
            })
          })
        })
      } else {
        res.send('Sorry mate- insufficient funds')
      }
    })
  },

  settleDispute: (req, res) => {
    Pin.findOne({_id: req.params.pinId}, (err, pin) => {
      if(err) res.send(err)
      if(pin.owner == req.body.loser) { // IF THE OWNER OF THE PIN LOSES
        pin.owner = req.body.winner     // THE WINNER NOW OWNS THAT PIN
        pin.save().then(() => {
          res.send(pin)
        })
      } else { // IF THE CHALLENGER LOSES
        Game.findOne({_id: req.params.gameid}, (err, game) => {
          if(err) res.send(err)
          var amountToBeAddedToPin;
          game.scoreboard.forEach((score) => {
            if(score.user == req.body.loser){
              amountToBeAddedToPin = score.points
              score.points = 0  // REDUCE LOSER'S POINTS TO NOTHING!
            }
          })
          game.save().then(() => {
            pin.points += amountToBeAddedToPin // TRANSFER ALL OF THE CHALLENGER'S POINTS TO THE WINNER'S PIN
            pin.save().then(() => {
              res.send(pin)
            })
          })
        })
      }
    })
  }
};
