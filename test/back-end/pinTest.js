process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server/server');
var should = chai.should();
var Game = require("../../server/models/game");
var Pin = require("../../server/models/pin");
var User = require("../../server/models/user");

chai.use(chaiHttp);

describe('Pins', function () {
  var game;
  before(function(done){
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    }).save(function (err, testGame) {
      game = testGame
      done()
    })
  })

  it('should not allow users to create pins, if they have not joined a game', function (done) {
    chai.request(server) // Sending post request to create a pin for a specific game
    .post('/games/' + game._id + '/pins')
    .set({ 'authorization': 'test' })
    .send({ address: '123 Testing Ave' })
    .end(function(err, res){
        console.log('RES BOD: ', res.text)
        res.text.should.equal('Sorry mate- you must join this game before you can add pins to it')
        done();
    });
  });

  it('should allow a logged in user to join a game, create a pin, and have that pin logged in the scoreboard', function (done) {
    chai.request(server)
    .put('/games/' + game._id) // JOIN THE GAME
    .set({ 'authorization': 'test' })
    .end(function (err, res) {
      chai.request(server) // Sending post request to create a pin for a specific game
      .post('/games/' + game._id + '/pins')
      .set({ 'authorization': 'test' })
      .send({ address: 'Testing Ave', points: 20 })
      .end(function(err, res){
        Game.findOne({_id: game._id}, (err, game) => {
          game.scoreboard[0].pins[0].toString().should.equal(res.body._id)
          game.scoreboard[0].points.should.equal(80)
          chai.request(server) // Sending post request to create a pin for a specific game
          .post('/games/' + game._id + '/pins')
          .set({ 'authorization': 'test' })
          .send({ address: 'Testing Ave 2', points: 300 })
          .end(function(err, res2){
            res2.text.should.equal('Sorry dude- not enough points')
            done()
          })
        })
      })
    });
  });

  it('should delete a pin successfully', function (done) {
    Pin.collection.drop()
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    })
    .save(function(err, game) {
      chai.request(server)
      .put('/games/' + game._id) // JOIN THE GAME
      .set({ 'authorization': 'test' })
      .end(function (err, res) {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: 'Testing Ave', points: 90 })
        .end(function(err, pin){
          chai.request(server)
          .delete('/games/' + game._id + '/pins/' + pin.body._id).set({'authorization' : 'test'}).end(function(){
            chai.request(server)
            .get('/games/' + game._id + '/pins').set({ 'authorization': 'test' }).end(function (err,res){
              res.body.length.should.equal(0)
              chai.request(server)
              .get('/games/' + game._id)
              .set({ 'authorization': 'test' })
              .end(function (err,res){
                res.body[0].scoreboard[0].points.should.equal(100) // should give user back their points
                res.body[0].scoreboard[0].pins.length.should.equal(0)
                done()
              })
            })
          })
        })
      })
    })
  })

  it('should get a users current points', function (done){
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    }).save(function (err, game) {
      chai.request(server).put('/games/' + game._id)
      .set({ 'authorization': 'test' })
      .end(function(err, res) {
        chai.request(server)
        .get('/games/' + game._id + '/points')
        .set({ 'authorization' : 'test'})
        .end(function (err,res){
          res.body[0].points.should.equal(100)
          done()
        })
      })
    });
  });

  it('should not allow a user to add a pin to the same address twice in a game', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    })
    .save(function(err, game) {
      chai.request(server)
      .put('/games/' + game._id) // JOIN THE GAME
      .set({ 'authorization': 'test' })
      .end(() => {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: '123 Testing Ave', points: 10})
        .end((err, res1) => {
          chai.request(server) // Sending post request to create a pin for a specific game
          .post('/games/' + game._id + '/pins')
          .set({ 'authorization': 'test' })
          .send({ address: '123 Testing Ave', points: 10 })
          .end((err, res2) => {
            res2.text.should.equal('Sorry mate- that pin already exists')
            done()
          })
        })
      })
    })
  })

  it('should not allow a user to add more than 3 pins to a game', function (done){
    new Pin({
        address: '123 Test Ave.',
        name: 'test pin',
        coordinates: [],
        game: game._id,
        creator: '58221b1deb8543b7ba21e39f'
      }).save(() => {
        new Pin({
            address: '124 Test Ave.',
            name: 'test pin',
            coordinates: [],
            game: game._id,
            creator: '58221b1deb8543b7ba21e39f'
          }).save(() => {
            new Pin({
                address: '125 Test Ave.',
                name: 'test pin',
                coordinates: [],
                game: game._id,
                creator: '58221b1deb8543b7ba21e39f'
              }).save(() => {
                chai.request(server)
                .post('/games/' + game._id + '/pins')
                .set({'authorization' : 'test'})
                .send({address: '126 Testing Ave'})
                .end(function(err, res){
                  res.text.should.equal('Sorry dude- 3 pins already')
                  done();
                });
              })
          })
      })
    //Adding three pins to the database for the logged in user
  })

  it('should allow a user to withdrawal from a pin if it has that many points', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    })
    .save(function(err, game) {
      chai.request(server)
      .put('/games/' + game._id)
      .set({ 'authorization': 'test' })
      .end(function () {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: '123 Testing Ave', points: 25 })
        .end((err, pin) => {
          chai.request(server)
          .put('/games/' + game._id + '/pins/' + pin.body._id + '/withdrawal')
          .set({ 'authorization': 'test' })
          .send({ points: 20 })
          .end((err, res) => {
            res.body.points.should.equal(5)
            done()
          })
        })
      })
    })
  })

  it('should allow a user to deposit to a pin they have enough points', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    })
    .save(function(err, game) {
      chai.request(server)
      .put('/games/' + game._id)
      .set({ 'authorization': 'test' })
      .end(function () {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: '123 Testing Ave', points: 10 })
        .end((err, pin) => {
          chai.request(server)
          .put('/games/' + game._id + '/pins/' + pin.body._id + '/deposit')
          .set({ 'authorization': 'test' })
          .send({ points: 30 })
          .end((err, res) => {
            res.body.points.should.equal(40) // Test that points were added to pin
            Game.findOne({_id: res.body.game}, (err, game) => {
              game.scoreboard[0].points.should.equal(60) // Test that points were deducted from user
              done()
            })
          })
        })
      })
    })
  })

  it('should not allow a user to deposit to a pin if they do not have enough points', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    })
    .save(function(err, game) {
      chai.request(server)
      .put('/games/' + game._id)
      .set({ 'authorization': 'test' }) // test user joins the game
      .end(function () {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: '123 Testing Ave', points: 10 })
        .end((err, pin) => {
          chai.request(server)
          .put('/games/' + game._id + '/pins/' + pin.body._id + '/deposit')
          .set({ 'authorization': 'test' })
          .send({ points: 101 })
          .end((err, res) => {
            res.text.should.equal('Sorry mate- insufficient funds')
            done()
          })
        })
      })
    })
  })

  it('should appropriately settle dispute if challenger wins', function (done) {
    User.collection.drop();
    var gameId;
    var pinId
    new User({
      firstName: 'Test Challenger',  // CREATE TEST USER NUMBER ONE
      email: 'test@test.com'
    })
    .save(function(err, user) {
      new Game({  //  CREATE NEW GAME AND ASSOCIATE TEST USER NUMBER ONE WITH THAT GAME
        name: 'test game name',
        pins: [],
        users: [{_id: user._id, firstName: user.firstName}],
        scoreboard: [{user: user._id, points: 100}],
        remain: 12
      })
      .save(function(err, game) {
        gameId = game._id
        chai.request(server)
        .put('/games/' + game._id)
        .set({ 'authorization': 'test' }) // CREATE AND ASSOCIATE TEST USER NUMBER TWO WITH SAME GAME
        .end(function (err, game) {
          chai.request(server) // Sending post request to create a pin for a specific game
          .post('/games/' + game.body[0]._id + '/pins')
          .set({ 'authorization': 'test' })
          .send({ address: '123 Testing Ave', points: 10 })
          .end((err, pin) => {
            pinId = pin.body._id
            pin.body.owner.should.equal('58221b1deb8543b7ba21e39f')
            chai.request(server)
            .put('/games/' + game.body[0]._id + '/pins/' + pin.body._id + '/settleDispute')
            .set({'authorization': 'test'})
            .send({winner: user._id, loser: '58221b1deb8543b7ba21e39f'})
            .end((err, res) => {
              res.body.owner.should.equal(user._id.toString())
              res.body.points.should.equal(10) // PIN'S POINTS SHOULD NOT CHANGE
              Game.findOne({_id: gameId}, (err, game) => {
                game.scoreboard[0].pins.length.should.equal(1) // SCOREBOARD SHOULD UPDATE BY MOVING THE CONQUERED PIN ID TO THE CONQUERER'S PINS ARRAY
                game.scoreboard[0].pins[0].toString().should.equal(pinId)
                done()
              })
            })
          })
        })
      })
    })
  })

  it('should appropriately settle dispute if defender wins', function (done) {
    new User({
      firstName: 'Test Defender',  // CREATE TEST USER NUMBER ONE
      email: 'test@test.com'
    })
    .save(function(err, user) {
      new Game({  //  CREATE NEW GAME AND ASSOCIATE TEST USER NUMBER ONE WITH THAT GAME
        name: 'test game name',
        pins: [],
        users: [{_id: user._id, firstName: user.firstName}],
        scoreboard: [{user: user._id, points: 50}],
        remain: 12
      })
      .save(function(err, game) {
        chai.request(server)
        .put('/games/' + game._id)
        .set({ 'authorization': 'test' }) // CREATE AND ASSOCIATE TEST USER NUMBER TWO WITH SAME GAME
        .end(function (err, game) {
          chai.request(server) // Sending post request to create a pin for a specific game
          .post('/games/' + game.body[0]._id + '/pins')
          .set({ 'authorization': 'test' })
          .send({ address: '123 Testing Ave', points: 10 })
          .end((err, pin) => {
            pin.body.owner.should.equal('58221b1deb8543b7ba21e39f')
            chai.request(server)
            .put('/games/' + game.body[0]._id + '/pins/' + pin.body._id + '/settleDispute')
            .set({'authorization': 'test'})
            .send({winner: '58221b1deb8543b7ba21e39f', loser: user._id})
            .end((err, res) => {
              res.body.owner.should.equal('58221b1deb8543b7ba21e39f') // PIN OWNER SHOULD REMAIN THE SAME
              res.body.points.should.equal(60) // PIN SHOULD NOW HAVE ALL OF THE USER'S MONEY!
              done()
            })
          })
        })
      })
    })
  })
})
