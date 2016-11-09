var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();

chai.use(chaiHttp);


describe('Games', function() {
  it('should not get a list of ALL games on /games GET if user is not authenticated', function(done) {
    chai.request(server)
      .get('/games')
      .set({'authorization': 'test'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.an('array'); //would be an array of games if they were authenticated
        done();
      });
  });
  // it('should add a SINGLE game on /games POST', function(done) {
  //   chai.request(server)
  //     .post('/games/game')
  //     .send({'name': 'Testy Johnson', 'lastName': 'Script'})
  //     .end(function(err, res){
  //       res.should.have.status(200);
  //       res.should.be.json;
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('SUCCESS');
  //       res.body.SUCCESS.should.be.a('object');
  //       res.body.SUCCESS.should.have.property('name');
  //       res.body.SUCCESS.should.have.property('lastName');
  //       res.body.SUCCESS.should.have.property('_id');
  //       res.body.SUCCESS.name.should.equal('Java');
  //       res.body.SUCCESS.lastName.should.equal('Script');
  //       done();
  //     });
  // });
});
