  angular.module('trivial.score', [])

.controller('ScoreCtrl', ['$window', '$scope', '$ionicModal', '$location', 'gameSrvc', function($window, $scope,  $ionicModal, $location, gameSrvc) {


  $scope.users = [];
  var points = [];
  var pins;

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
      $scope.scoreboard = game[0].scoreboard
      $scope.scoreboard.forEach(function(user){
        var player = user.user
        points.push(user.points)
        gameSrvc.getPlayer(player)
        .then(function(player){
          $scope.users.push(player[0])
          for (var i = 0 ; i < $scope.users.length ; i++) {
            $scope.users[i].points = points[i]
          }
          gameSrvc.getPinsForGame(currentGameID)
          .then(function(pins) {
            for (var i = 0 ; i < $scope.users.length ; i++) {
              $scope.users[i].pins = pins.filter(function(pin) {
                return pin.owner === $scope.users[i]._id
              })
              .map(function(userPin) {
                return {owner: userPin.owner, name: userPin.name, address: userPin.address, points: userPin.points}
              })
            }
          })              
        })
      })
    })
    .catch(function(err){
      console.log('this is a getGame err', err)
    })
  }

  getGame()
  goBack()
 
}]);
