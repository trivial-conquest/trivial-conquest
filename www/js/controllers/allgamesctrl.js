angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', 'gameSrvc', '$window', 'userService', '$auth', function($scope, $stateParams, gameSrvc, $window, userService, $auth) {
 //will need to pull all games fom the server and attach them to scope variable
 var userData = $auth.getPayload();

  $scope.allgames = true

  $scope.myGames = function(){
    console.log('mygames')
    $scope.allgames = false;
  }

  $scope.allGames = function(){
    console.log('allgames')
    $scope.allgames = true;
  }

  $scope.iterateGames = function(game, user){
    console.log('this is the game', game)
    console.log('this is the user', user)
    for(var i = 0; i <game.users.length; i++){
      console.log('this is gameuserslength', game.users.length)
      if(game.users._id = user._id){
        return true
      }
    }
  }

 $scope.getGames = function(){
    gameSrvc.getAllGames()
    .then(function(games){
      if(typeof(games) === 'string') $window.location = '#/login'
      $scope.games = games
      console.log('these are all the games', games)
      games.forEach(function(game){
        console.log('these are the game users', game.users)
        $scope.users = game.users
      })
    })
    .catch(function(){
      console.log('no games retrieved')
      $scope.repeat = true
      $scope.allgames.gamename = null
    })
 }

  $scope.createGame = function(){
    console.log('this is inside createGmae', $scope.allgames.gamename, $scope.allgames.playerlimit)
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
    console.log('this is getCurrentUser', $scope.user)
  }

$scope.getGames()
$scope.getCurrentUser()

 }])
