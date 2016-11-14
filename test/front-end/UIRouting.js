'use strict';

describe('UI ROUTER', function () {
  var $state, $injector;
  beforeEach(module('trivial'));

  beforeEach(inject(function ($injector) {
    $state = $injector.get('$state')
  }));

  it('should load the allgames page.', function() {
    var state = $state.get('allgames');
    assert.isDefined(state.templateUrl);
    expect(state.templateUrl).to.equal('templates/allgames.html');
    expect(state.controller).to.equal('AllGamesCtrl as allgames');
  });

   it('should load the games page.', function() {
    var state = $state.get('games');
    assert.isDefined(state.templateUrl);
    expect(state.templateUrl).to.equal('templates/games.html');
    expect(state.controller).to.equal('GamesCtrl');
  });

   it('should load the login page.', function() {
    var state = $state.get('login');
    assert.isDefined(state.templateUrl);
    expect(state.templateUrl).to.equal('templates/login.html');
    expect(state.controller).to.equal('LoginCtrl');
  });
});
