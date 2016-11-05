const db = require('../models/config')
const Pin = require('../models/pin')

module.exports = {
  createNewPin: (req, res) => {
    new Pin({
      owner: '581cbb4c5db5083463acf243', //dummy userId
      game: req.params.gameid,
      name: req.body.name,
      address: req.body.address
    })
    .save().then((pin) => {
      console.log('successfully created pin: ', pin)
      res.redirect('/')
    })
    .catch((err) => {
      console.log('ERROR: ', err)
    })
  }
};
