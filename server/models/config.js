const mongoose = require('mongoose');
mongoose.Promise = global.Promise

var mongoURI = {
  // development: 'mongodb://localhost:27017/conquest',
  // test: 'mongodb://localhost:27017/conquest-test',
   production: 'mongodb://heroku_9snx0qqf:pv336jedvqno38v7mcvs5ncgdb@ds147777.mlab.com:47777/heroku_9snx0qqf'
};

const db = mongoose.connect(mongoURI[process.env.NODE_ENV], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + mongoURI[process.env.NODE_ENV]);
  }
});

module.exports = db;
