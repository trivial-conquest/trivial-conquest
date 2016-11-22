const db = require('../models/config')
const User = require('../models/user')

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
  }, 


  getOne: (req, res) => {
    User.find({_id: req.params.userid}, (err, user) => {
      if (err) {
        console.log(`Error in finding game: ${err}`);
        res.send(err);
      } else {
        res.send(user);
      }
    })
  }
};
