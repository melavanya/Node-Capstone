const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const {app, runServer, closeServer} = require('../server');
chai.use(chaiHttp);


describe('Movies', function() {


  before(function() {
    return runServer();
  });


  after(function() {
    return closeServer();
  });


  it('should get details of a movie', function() {
   var searchTerm = "Forrest Gump";
   var query = encodeURI(searchTerm);
    return chai.request(app)
      .get('/movies?query='+query)
      .then(function(res) {
        res.should.be.json;
        res.body.Title.should.equal(searchTerm);
        });
      });
  });
