const mongoose = require('mongoose')
const Game     = require('./game')
const User     = require('./user')

const Schema = mongoose.Schema

const pinSchema = new Schema({
  address: { type: String, required: true },
  name: { type: String },
  coordinates: [],
  owner: {type: Schema.ObjectId, ref: 'User' },
  game: {type: Schema.ObjectId, ref: 'Game' }
})

const Pin      = mongoose.model('Pin', pinSchema)
module.exports = Pin
