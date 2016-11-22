  angular.module('trivial.score', [])

.controller('ScoreCtrl', ['$window', '$scope', '$ionicModal', '$location', 'gameSrvc', function($window, $scope,  $ionicModal, $location, gameSrvc) {


  allusers = [];
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
      console.log('this is the game', game)
      $scope.scoreboard = game[0].scoreboard
      $scope.scoreboard.forEach(function(user){
        console.log('this is the user', user)
        var player = user.user
        points.push({points: user.points, user: user.user})
        console.log('this is the points', points)
        gameSrvc.getPlayer(player)
        .then(function(player){
          allusers.push(player[0])
          for (var i = 0 ; i < allusers.length ; i++) {
            for (var j =0; j <points.length; j++){
              console.log('this is pointsinloop', points[j])
              console.log('this is allusers[i]', allusers[i])
              if(allusers[i]._id === points[j].user){
              console.log('this was a match', allusers[i]._id, points[j].user)
                allusers[i].points = points[j]
              }
            }
          }
          gameSrvc.getPinsForGame(currentGameID)
          .then(function(pins) {
            for (var i = 0 ; i < allusers.length ; i++) {
              allusers[i].pins = pins.filter(function(pin) {
                return pin.owner === allusers[i]._id
              })
              .map(function(userPin) {
                console.log('owner', userPin)
                return {owner: userPin.owner, name: userPin.name, address: userPin.address, points: userPin.points}
              })
            }
            $scope.users = allusers
          })         
        })
      })
    })
    .catch(function(err){
      console.log('this is a getGame err', err);
    })
  }

  getGame()
  goBack()
 
}]);
