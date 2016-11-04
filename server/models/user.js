const mongoose   = require('mongoose')
//hashing tool
//average number of rounds
const Schema     = mongoose.Schema
//set up for a new user
const userSchema = new Schema({
  username: { type: String, required: true }
})

const User      = mongoose.model('User', userSchema)
module.exports  = User
