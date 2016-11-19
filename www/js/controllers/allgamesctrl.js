angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', 'gameSrvc', '$window', 'userService', '$auth', function($scope, $stateParams, gameSrvc, $window, userService, $auth) {
 //will need to pull all games fom the server and attach them to scope variable
 var userData = $auth.getPayload();

  $scope.allgames = true
  $scope.endedgames=[{name: 'Christinas Game', remain: 5, limit: 6, users: {firstName: 'Tina', lastName: 'Mull'}}, 
  {name: 'Christinas2nd Game', remain: 5, limit: 6, users: {firstName: 'Tina', lastName: 'Mull'}}];

  $scope.myGames = function(){
    $scope.allgames = false;
    $scope.gamesfinished = false;
  }

  $scope.allGames = function(){
    $scope.allgames = true;
     $scope.gamesfinished = false;
  }

  $scope.finishedGames=function(){
    $scope.gamesfinished = true;
  }



  $scope.iterateGameUser = function(game, user){
    var truthTest;
    for(var i = 0; i <game.users.length; i++){
      if(game.users[i]._id === user._id){
        return true
      } else {
        truthTest=false
      }
    } return truthTest
  }

  $scope.finished = function(games){
    games.forEach(function(game){
      if(game.winner!==undefined){
         $scope.endedGames.push(games)
      }
    })
  }

 $scope.getGames = function(){
    gameSrvc.getAllGames()
    .then(function(games){
      if(typeof(games) === 'string') $window.location = '#/login'
      $scope.games = games
      console.log('$$$$$$$$$$$$$$$$$$this is games', games)
      $scope.finished(games)
    })
    .catch(function(){
      console.log('no games retrieved')
      $scope.repeat = true
      $scope.allgames.gamename = null
    })
 }

  $scope.createGame = function(){
    gameSrvc.createGame($scope.allgames.gamename, $scope.allgames.playerlimit) //Will change this to a scope variable later
    .then(function(game){
      $scope.getGames()
      $scope.allgames.gamename = null
      $scope.allgames.playerlimit = null
      $scope.allgames.repeat = function(){
        return false;
      }
      $window.location = '#/games/' + game._id
  	})
  	.catch(function(){
  		console.log('this didnt work')
      $scope.allgames.repeat = function(){
        return true;
      }
  	})
  },

  $scope.logout = function(){
    userService.logout()
    $window.location = '#/login'
  }

  $scope.getCurrentUser = function(){
    $scope.user = userData;
  }

$scope.getGames()
$scope.getCurrentUser()

 }])
