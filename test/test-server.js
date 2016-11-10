process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();
var Game = require("../server/models/game");

chai.use(chaiHttp);


describe('Games', function() {

  afterEach(function(done){
    Game.collection.drop();
    done();
  });

  it('should get a list of ALL games on /games GET', function(done) {
    chai.request(server)
      .get('/games')
      .set({'authorization': 'test'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.an('array'); //would be an array of games if they were authenticated
        done();
      });
  });

  it('should not get list of all games on /games GET if user is not authenticated', function(done) {
    chai.request(server)
      .get('/games')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should add a SINGLE game on /games POST', function(done) {
    chai.request(server)
      .post('/games/game')
      .set({'authorization': 'test'})
      .send({'name': 'Testy Johnson'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.name.should.equal('Testy Johnson');
        res.body.users[0].should.equal('58221b1deb8543b7ba21e39f');
        done();
      });
  });
});
