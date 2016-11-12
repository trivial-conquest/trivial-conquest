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
    $httpBackend.expectPOST('/games').respond(201, mockGame);
    gameSrvc.createGame()
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

    $httpBackend.expectGET('/games').respond(201, mockResponse);
   gameSrvc.getAllGames();
    $httpBackend.flush();
   
    });

});