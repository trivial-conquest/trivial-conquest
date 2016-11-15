const db = require('../models/config')
const Pin = require('../models/pin')
const Game = require('../models/game')

module.exports = {
  createNewPin: (req, res) => {
    //First checking to see how many pins user has already created
    Pin.find({game : req.params.gameid})
    .then((pins) => {
      var userPins = pins.filter(function(pin){
        return pin.creator == req.tokenPayload._id
      })
      //If the user has created 3 pins already, throw an error
      if(userPins.length >= 3) {
        return res.status(500).send()
      }
      Pin.find({game: req.params.gameid, address: req.body.address}).then(repeats => {
        console.log('REPEATS: ', repeats)
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
            res.send(pin)
          })
          .catch((err) => {
            console.log('ERROR: ', err)
            res.status(500).send('Pin limit reached')
          })
        }
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
          console.log("This pin's points are now: ", pin.points)
          Game.findOne({_id: req.params.gameid}, (err, game) => {
            game.scoreboard.forEach(score => {
              if(score.user == req.tokenPayload._id) {
                score.points += req.body.points
              }
            })
            game.save().then(() => {
              console.log(req.tokenPayload.firstName + " has withdrawn " + req.body.points.toString())
              res.send(game)
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
            console.log('score points')
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
      console.log('PIN OWNER: ', pin.owner)
      console.log('LOSER: ', req.body.loser)
      if(pin.owner == req.body.loser) {
        pin.owner = req.body.winner
        pin.save().then(() => {
          res.send(pin)
        })
      }
    })
  }
};
