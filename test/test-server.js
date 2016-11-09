var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();

chai.use(chaiHttp);


describe('Games', function() {
  it('should list ALL games on /games GET', function(done) {
    chai.request(server)
      .get('/games')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});
