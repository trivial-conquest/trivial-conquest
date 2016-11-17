  angular.module('trivial.score', [])

.controller('ScoreCtrl', ['$window', '$rootScope', '$scope', '$ionicModal', '$location', 'gameSrvc', function($window, $rootScope, $scope,  $ionicModal, $location, gameSrvc) {


  $scope.users = [];
  var points = [];
    // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/score.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
    return $location.$$url.replace('/games/','').replace('/score', '')
  }

  var currentGameID = getCurrentGameID();

  var goBack = function(){
    $scope.goBack = {url: "#/games/" + currentGameID}
    return  $scope.goBack
  }

  var getGame = function(){
    gameSrvc.getOneGame(currentGameID)
    .then(function(game){
      $scope.games = game[0].scoreboard
      $scope.games.forEach(function(game){
        var player = game.user
        points.push(game.points)
        gameSrvc.getPlayer(player)
        .then(function(player){
          $scope.users.push(player[0])
          $scope.users.forEach(function(user){
            points.forEach(function(point){
              user.points = point
            })
          })
        })
      })
    })
    .catch(function(err){
      console.log('this is a getGame err', err)
    })
  }

  // scoreboard
  // owner's points (cash) | pins {address, points}
  // for each member of game 

  getGame()
  goBack()
 
}]);
