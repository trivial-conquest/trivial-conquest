'use strict';

describe('userService', function() {
  var $httpBackend, $injector, userService, $rootScope, $auth, mockUserData;
  
 
  beforeEach(module('trivial'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $auth = $injector.get('$auth');
    userService = $injector.get('userService');
    mockUserData = $auth.getPayload()

  }));

  it('should have a method isAuthenticated', function () {
      expect(userService.isAuthenticated).to.be.a('function');
  });

  it('should be able to log a user out with logout()', function () {
      expect(userService.logout()).to.equal(undefined);  
  })

  it('should be able to get a users data with getUser()', function () {
      expect(userService.getUser()).to.equal(mockUserData);  
  })

   it('should be able to get a users data when authentication is succesful', function () {
      expect(userService.successAuth()).to.equal(mockUserData);  
  })

  it('should not be able to get a users data when authentication fails', function () {
      expect(userService.failedAuth()).to.equal(undefined);  
  })


});