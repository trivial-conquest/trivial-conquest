  angular.module('trivial.score', [])

.controller('ScoreCtrl', ['$window', '$rootScope', '$scope', '$ionicModal', '$location', 'gameSrvc', function($window, $rootScope, $scope,  $ionicModal, $location, gameSrvc) {


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
      // is an array of objects w/ user, pins array, points
      console.log('SCOREBOARD', $scope.scoreboard)
      $scope.scoreboard.forEach(function(user){
        // each user object
        var player = user.user
        points.push(user.points)
        gameSrvc.getPlayer(player)
        .then(function(player){
          $scope.users.push(player[0])
          // $scope.users.forEach(function(person){
            // points.forEach(function(point){
            //   console.log('pers', person, 'pt', point)
            //   person.points = point
            // })
          // })
          for (var i = 0 ; i < $scope.users.length ; i++) {
            $scope.users[i].points = points[i]
          }
            gameSrvc.getPinsForGame(currentGameID)
            .then(function(pins) {
              for (var i = 0 ; i < $scope.users.length ; i++) {
                console.log('2', $scope.users[i])
                $scope.users[i].pins = pins.filter(function(pin) {
                  console.log('pincreat', pin.creator, 'player', user.user)
                  return pin.creator === $scope.users[i]._id
                })
                .map(function(userPin) {
                  return {creator: userPin.creator, name: userPin.name, address: userPin.address, points: userPin.points}
                })
              }
              console.log('end', $scope.users)
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
