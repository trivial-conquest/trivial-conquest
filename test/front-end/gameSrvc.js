'use strict';

describe('gameSrvc', function() {
  var $http, $httpBackend, $window, $injector, gameSrvc;
  
 
  beforeEach(module('trivial.gamesrvc'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    gameSrvc = $injector.get('gameSrvc');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

    it('should be able to create new games with createGame()', function () {
      var mockGame = {
       id: "58264fd30b303f2a901855gg",
       createdAt:"2016-11-11T23:10:11.663Z",
       limit: 3, 
       name: "started",
       remain:2,
       updatedAt: "2016-11-11T23:10:11.671Z",
       users: ["5820e53a510efd124cee9555"] 
      }
    $httpBackend.expectPOST('/games').respond(mockGame);
    gameSrvc.createGame().then(function(resp){
      expect(resp.id).to.equal("58264fd30b303f2a901855gg")
      expect(resp.name).to.equal("started")
    })
    $httpBackend.flush();
   
  });

    it('should be able to get all games with getGames()', function () {
      var mockResponse = [
       {id: "58264fd30b303f2a901899ff",
       createdAt:"2016-11-11T23:10:11.663Z",
       limit: 4, 
       name: "Blechyblech",
       remain:3,
       updatedAt: "2016-11-11T23:10:11.671Z",
       users: ["5820e53a510efd124cee9375"] }, 

      {id: "58264fd30b303f2a901988ff",
       createdAt:"2016-11-11T23:10:11.663Z",
       limit: 5, 
       name: "test",
       remain:3,
       updatedAt: "2016-11-11T23:10:11.671Z",
       users: ["5820e53a510efd124cee9375", "5820e53a510efd124cee9775"] }, 
      ];

    $httpBackend.expectGET('/games').respond(mockResponse);
   gameSrvc.getAllGames().then(function(games){
    expect(games).to.deep.equal(mockResponse)
   });
    $httpBackend.flush();
   
    });


     it('should be able to get all pins for game with getPinsForGame()', function () {

      var mockpins = [{
       id: "5827662085c81e00ac26e002",
       formatted_address: "8110 Red Willow Dr, Austin, TX 78736, USA",
       coordinates: [30.240524, -97.89131499999996], 
       creator: "5820e53a510efd124cee9375",
       game:"58264fd30b303f2a901899ff",
       icon: "https://graph.facebook.com/1844772705756251/picture?type=large",
       name: "8110 Red Willow Dr",
       owner: "5820e53a510efd124cee9375" },

       { id: "5827662085c81e00ac26e003",
       formatted_address: "8000 Red Willow Dr, Austin, TX 78736, USA",
       coordinates: [30.240524, -97.89131499999996], 
       creator: "5820e53a510efd124cee9375",
       game:"58264fd30b303f2a901899ff",
       icon: "https://graph.facebook.com/1844772705756251/picture?type=large",
       name: "8000 Red Willow Dr",
       owner: "5820e53a510efd124cee9375"}
       ];

    $httpBackend.expectGET('/games/58264fd30b303f2a901899ff/pins').respond(mockpins);
    gameSrvc.getPinsForGame("58264fd30b303f2a901899ff").then(function(pins){
     expect(pins).to.deep.equal(mockpins)
    })
    $httpBackend.flush();
   
    });

    it('should be able to add a pin with addPin()', function () {
      var mockpin = {
      formatted_address: "8110 Red Willow Dr, Austin, TX 78736, USA",
       coordinates: [30.240524, -97.89131499999996], 
       geometry: {location: {lat: function(){return 30.240524}, lng: function(){return -97.89131499999996}}},
       name: "8110 Red Willow Dr" };

    $httpBackend.expectPOST('/games/58264fd30b303f2a901899ff/pins').respond(mockpin);
    gameSrvc.addPin(mockpin, "58264fd30b303f2a901899ff").then(function(resp){
      expect(resp.name).to.equal("8110 Red Willow Dr")
    })
    $httpBackend.flush();
    });

   it('should be able to claim a pin with claimPin()', function () {

    $httpBackend.expectPUT('/games/58264fd30b303f2a901899ff/pins/5827662085c81e00ac26e002').respond(201);
    gameSrvc.claimPin( "58264fd30b303f2a901899ff", "5827662085c81e00ac26e002").then(function(resp){
      expect(resp.status).to.equal(201)
    })
    $httpBackend.flush();
    });
    
    it('should be able to delete a pin with deletePin()', function () {

    $httpBackend.expectDELETE('/games/5827662085c81e00ac26e002/pins/58264fd30b303f2a901899ff').respond(201);
    gameSrvc.deletePin( "58264fd30b303f2a901899ff", "5827662085c81e00ac26e002").then(function(resp){
      expect(resp.status).to.equal(201)
    })
    $httpBackend.flush();
    });

    it('should be able to join a pin with joinGame()', function () {

    $httpBackend.expectPUT('/games/58264fd30b303f2a901899ff').respond(201);
    gameSrvc.joinGame( "58264fd30b303f2a901899ff").then(function(resp){
    expect(resp.status).to.equal(201)
    })
    $httpBackend.flush();
    });

});