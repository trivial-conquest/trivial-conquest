'use strict';

describe('AllGamesCtrl', function() {
  var $rootScope, userService, $stateParams, $location, $window, $httpBackend, $auth, gameSrvc, $scope, createController, $injector;
  
 
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
       users: ["5820e53a510efd124cee9555"] 
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
       users: ["5820e53a510efd124cee9375", "5820e53a510efd124cee9775"] }, 
      ];

    $httpBackend.expectGET('http:/localhost:8080/games').respond(mockResponse);
    $scope.getGames();
   
    });

   it('should be able to get the data of the current user with getCurrentUser()', function () {
     var mockUser ={
      _id : "5820e53a510efd124cee9375",
      updatedAt : "2016-11-07T20:34:02.327Z",
      createdAt : "2016-11-07T20:34:02.327Z",
      profilePicture : "https://graph.facebook.com/1844772705756251/picture?type=large",
      firstName : "Tina", 
      lastName : "Mull", 
      email : "cmullenxx@gmail.com", 
      tokens : [ ], 
      profiles : { "facebook" : "1844772705756251" }, "__v" : 0 }

    $scope.getCurrentUser()
    // .then(function(user){
    //   expect(user).to.equal('mockUser');
    // })

  });

});