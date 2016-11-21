'use strict';

describe('AllGamesCtrl', function() {
  var $rootScope, userService, $stateParams, $location, $window, $httpBackend, $auth, gameSrvc, $scope, createController, $injector, ngSweetAlert;
  
 
  beforeEach(module('trivial'));
  beforeEach(module('templates'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    userService = $injector.get('userService');
    $stateParams= { gameId: 1 };
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    $auth = $injector.get('$auth');
    gameSrvc= $injector.get('gameSrvc');
    ngSweetAlert= $injector.get('oitozero.ngSweetAlert');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AllGamesCtrl for testing
    createController = function () {
      return $controller('AllGamesCtrl', {
        $rootScope: $rootScope, 
        userService: userService,
        $stateParams: $stateParams, 
        $location: $location,
        $window: $window,
        $httpBackend: $httpBackend,
        $auth: $auth,
        gameSrvc: gameSrvc,
        ngSweetAlert: ngSweetAlert,
        $scope: $scope
      });
    };

    createController();
  }));

   it('should have a createGame property on the $scope', function () {
    expect($scope.createGame).to.be.a('function');
  });

    it('should have a getGames property on the $scope', function () {
    expect($scope.getGames).to.be.a('function');
  });

    it('should be able to create new games with createGame()', function () {
      var mockGame = {
       id: "58264fd30b303f2a901855gg",
       createdAt:"2016-11-11T23:10:11.663Z",
       limit: 3, 
       name: "started",
       remain:2,
       updatedAt: "2016-11-11T23:10:11.671Z",
       users: [{_id: "5820e53a510efd124cee9375", firstName: 'Tina', lastName:'Mull'}] 
      }
    $httpBackend.expectPOST('/games').respond(201, mockGame);
    $scope.createGame();
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
       users: [{_id: "5820e53a510efd124cee9375", firstName: 'Tina', lastName:'Mull'}, {_id: "5820e53a510efd124cee9777", firstName: 'Oscar', lastName:'Lew'}] 
      }, 
      ];

    $httpBackend.expectGET('/games').respond(200, mockResponse);
    $scope.getGames();
    });

 it('should be able to show games the user is playing in $scope.iterateGameUser', function () {

  var gameMock = {id: "58264fd30b303f2a901988ff",
   createdAt:"2016-11-11T23:10:11.663Z",
   limit: 5, 
   name: "test",
   remain:3,
   updatedAt: "2016-11-11T23:10:11.671Z",
   users: [{_id: "5820e53a510efd124cee9375", firstName: 'Tina', lastName:'Mull'}, {_id: "5820e53a510efd124cee9777", firstName: 'Oscar', lastName:'Lew'}] 
  } 

  var userMock ={_id: "5820e53a510efd124cee9375", firstName: 'Tina', lastName:'Mull'}
   expect($scope.iterateGameUser(gameMock, userMock)).to.equal(true); 
  });
   
 it('should be able to not show games the user is not playing in with $scope.iterateGameUser', function () {

  var gameMock = {id: "58264fd30b303f2a901988ff",
   createdAt:"2016-11-11T23:10:11.663Z",
   limit: 5, 
   name: "test",
   remain:3,
   updatedAt: "2016-11-11T23:10:11.671Z",
   users: [{_id: "5820e53a510efd124cee9375", firstName: 'Tina', lastName:'Mull'}, {_id: "5820e53a510efd124cee9777", firstName: 'Oscar', lastName:'Lew'}] 
  } 

  var userMock ={_id: "5820e53a510efd124cee9555", firstName: 'Ash', lastName:'Nan'}
   expect($scope.iterateGameUser(gameMock, userMock)).to.equal(false); 
  });



});