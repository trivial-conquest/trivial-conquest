const db = require('../models/config')
const Game = require('../models/game')

module.exports = {

  post: (req, res) => {
    console.log('REQUEST: ', req)
    console.log('REQUEST BODY: ', req.body)
    const username =  req.body.username
    User.findOne({username: username})
    .then((user) => {
      if(!user) {
        var newUser = new User({
          username: username
        })
        newUser.save()
        .then((user) => {
          res.redirect('/')
        })
      } else {
        const err = new Error({error: 'This username is already taken'})
        res.send(err)
      }
    })
  }
};
