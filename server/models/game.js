const mongoose = require('mongoose')
const User     = require('./user')
const Pin 	   = require('./pin')

const Schema = mongoose.Schema

const gameSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  users: [],
  limit: {type: String},
  remain: {type: Number},
  scoreboard: [{
    points: { type: Number, default: 100 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  }]
},
{
  timestamps: true
})

const Game     = mongoose.model('Game', gameSchema)
module.exports = Game
