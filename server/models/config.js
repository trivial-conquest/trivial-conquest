const mongoose = require('mongoose');
mongoose.Promise = global.Promise

var mongoURI = {
  development: 'mongodb://localhost:27017/conquest',
  test: 'mongodb://localhost:27017/conquest-test'
};

const db = mongoose.connect(mongoURI[process.env.NODE_ENV], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + mongoURI[process.env.NODE_ENV]);
  }
});

module.exports = db;
