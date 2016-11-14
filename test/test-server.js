process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();
var Game = require("../server/models/game");
var Pin = require("../server/models/pin");

chai.use(chaiHttp);

describe('Games', function () {

  afterEach(function (done) {
    Game.collection.drop();
    Pin.collection.drop();
    done();
  });

  it('should get a list of ALL games on /games GET', function (done) {
    chai.request(server).get('/games').set({ 'authorization': 'test' }).end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.an('array'); //would be an array of games if they were authenticated
      done();
    });
  });

  it('should not get list of all games on /games GET if user is not authenticated', function (done) {
    chai.request(server).get('/games').end(function (err, res) {
      res.should.have.status(200);
      res.body.should.be.an('object');
      done();
    });
  });

  it('should add a game on /games POST', function (done) {
    chai.request(server).post('/games').set({ 'authorization': 'test' }).send({ 'name': 'Testy Johnson', limit: 4 }).end(function (err, res) {
      res.should.have.status(200);
      res.body.name.should.equal('Testy Johnson');
      res.body.users[0]._id.should.equal('58221b1deb8543b7ba21e39f');
      done();
    });
  });

  it('should get a single game on GET /games/:gameid', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: ['58221b1deb8543b7ba21e39f']
    }).save(function (err, game) {
      chai.request(server).get('/games/' + game._id).set({ 'authorization': 'test' }).end(function (err, res) {
        res.should.have.status(200);
        res.body[0].name.should.equal('test game name');
        res.body[0]._id.should.equal(game._id.toString());
        res.body[0].users[0].should.equal('58221b1deb8543b7ba21e39f');
        done();
      });
    });
  });

  it('should allow a logged in user to join a game if there is space', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 12
    }).save(function (err, game) {
      chai.request(server).put('/games/' + game._id).set({ 'authorization': 'test' }).end(function (err, res) {
        res.should.have.status(200);
        res.body[0].name.should.equal('test game name');
        res.body[0].remain.should.equal(11);
        res.body[0].users[0]._id.should.equal('58221b1deb8543b7ba21e39f');
        done();
      });
    });
  });
  it('should not allow a logged in user to join a game if there is not space', function (done) {
    new Game({
      name: 'test game name',
      pins: [],
      users: [],
      remain: 0
    })
    .save(function(err, game) {
        chai.request(server)
        .put('/games/' + game._id)
        .set({'authorization': 'test'})
        .end(function(err, res) {
          res.body[0].users.length.should.equal(0);
          done();
        })
    })
  })
});


describe('Pins', function () {
  var game;
  before(function(done){
    new Game({
      name: 'test game name',
      pins: [],
      users: []
    }).save(function (err, testGame) {
      game = testGame
      done()
    })
  })

  it('should allow users to create pins, and should be able to get pins for specific game', function (done) {
      chai.request(server) // Sending post request to create a pin for a specific game
      .post('/games/' + game._id + '/pins')
      .set({ 'authorization': 'test' })
      .send({ address: '123 Testing Ave' })
      .end(function(){
        chai.request(server) // Sending get request to retrieve all pins for that same game (only the one we added)
        .get('/games/' + game._id + '/pins').set({ 'authorization': 'test' }).end(function (err, res) {
          res.should.have.status(200);
          res.body[0].owner.should.equal('58221b1deb8543b7ba21e39f');
          res.body[0].address.should.equal('123 Testing Ave');
          done();
      });
    });
  });

  it('should show the user as owner after a successful claim', function (done) {
    new Pin({
      address: '123 Test Ave.',
      name: 'test pin',
      coordinates: [],
      game: game._id,
    }).save(function (err, pin){
      if(err) {
        console.log(err)
      }
      chai.request(server)
      .put('/games/' + game._id + '/pins/' + pin._id).set({ 'authorization' : 'test'}).end(function (err, res) {
        res.should.have.status(200);
        res.body.owner.should.equal('58221b1deb8543b7ba21e39f');
        done()
      })
    })
  })

  it('should delete a pin successfully', function (done) {
    Pin.collection.drop()
    new Pin({
      address: '124 Test Ave.',
      name: 'test pin',
      coordinates: [],
      game: game._id,
    }).save(function (err, pin){
      if(err) {
        console.log(err)
      }
      chai.request(server)
      .delete('/games/' + game._id + '/pins/' + pin._id).set({'authorization' : 'test'}).end()
      chai.request(server)
      .get('/games/' + game._id + '/pins').set({ 'authorization': 'test' }).end(function (err,res){
        res.body.length.should.equal(0)
        done()
      })
    })
  })

  it('should not allow a user to add a pin to the same address twice in a game', function (done) {
    Game.collection.drop();
    Pin.collection.drop();
    new Game({
      name: 'test game name',
      pins: [],
      users: []
    })
    .save(function(err, game) {
      chai.request(server) // Sending post request to create a pin for a specific game
      .post('/games/' + game._id + '/pins')
      .set({ 'authorization': 'test' })
      .send({ address: '123 Testing Ave' })
      .end((err, res1) => {
        chai.request(server) // Sending post request to create a pin for a specific game
        .post('/games/' + game._id + '/pins')
        .set({ 'authorization': 'test' })
        .send({ address: '123 Testing Ave' })
        .end((err, res2) => {
          res2.text.should.equal('Sorry mate- that pin already exists')
          done()
        })
      })
    })
  })
});
