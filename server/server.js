const express = require('express')
const path = require('path')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080
// app level middleware
app.use(express.static(path.resolve(__dirname, '../www')))
app.use(cookie())

app.get('/', (req,res) =>{
  res.render('index.html')
})

const server = app.listen(port)
console.log(`Server is running on port: ${port}`)

// export server for testing
module.exports = {
  server,
  app
}


// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');
//
// // Connection URL
// var url = 'mongodb://localhost:27017/conquest';
//
// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   insertDocuments(db, function() {
//     db.close();
//   });
// });
//
// var insertDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }
