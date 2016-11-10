const db = require('../models/config')
const Pin = require('../models/pin')

module.exports = {
  createNewPin: (req, res) => {
    new Pin({
      address: req.body.address,
      name: req.body.name,
      coordinates: req.body.coordinates,
      owner: req.tokenPayload._id, //dummy userId
      game: req.params.gameid,
      icon: req.body.icon
    })
    .save().then((pin) => {
      console.log('successfully created pin: ', pin)
      res.send(pin)
    })
    .catch((err) => {
      console.log('ERROR: ', err)
      res.send(err)
    })
  },

  deletePin: (req, res) => {
    Pin.find({_id: req.params.pinId}).remove()
    .then(() => {
      console.log('removed pin')
      // res.redirect('/')
    })
    .catch((err) => {
      console.log('ERROR: ', err)
    })
  },

  getPinsForGame: (req, res) => {
    Pin.find(`{game : ObjectId(${req.params.gameId})}`)
    .then((pins) => {
      res.send(pins)
    })
    .catch((err) =>{
      console.log('ERROR', err)
    })
  },

  updatePinOwner: (req, res) => {
    Pin.findOneAndUpdate({_id: req.params.pinId}, {owner: req.tokenPayload._id, icon: req.tokenPayload.profilePicture}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.send("succesfully saved");
    });
  }
};
