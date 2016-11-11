const mongoose = require('mongoose')
const User     = require('./user')
const Pin 	   = require('./pin')

const Schema = mongoose.Schema

const gameSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  users: [{type: Schema.ObjectId, ref: 'User'}],
  limit: {type: String},
  remain: {type: Number}
}, 
{
  timestamps: true
})

const Game     = mongoose.model('Game', gameSchema)
module.exports = Game
