const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/conquest');
module.exports = db;
