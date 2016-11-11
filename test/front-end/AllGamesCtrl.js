'use strict';

describe('AllGamesCtrl', function() {
  var $rootScope, userService, $stateParams, $location, $window, $httpBackend, $auth, gameSrvc, $scope, createController, $injector;

  beforeEach(module('trivial'));
  beforeEach(inject(function ($injector) {
    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    userService = $injector.get('userService');
    $stateParams= { listingId: 1 };
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
    $httpBackend.expectPOST('/games').respond(201, '');
    $scope.createGame();
    // $httpBackend.flush();
  });
});