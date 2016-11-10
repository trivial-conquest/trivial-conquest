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

 $scope.getGames = function(){
    gameSrvc.getAllGames()
    .then(function(games){
      console.log('all games retrieved', games)
      if(typeof(games) === 'string') $window.location = '#/login'
      $scope.games = games
    })
    .catch(function(){
      console.log('no games retrieved')
      $scope.repeat = true
      $scope.allgames.gamename = null
    })
 }

  $scope.createGame = function(){
    console.log('this is inside createGmae', $scope.allgames.gamename, $scope.allgames.playerlimit)
    gameSrvc.createGame($scope.allgames.gamename, $scope.allgames.playerlimit)
    .then(function(game){
      console.log("$$$$%%%^^#", game._id)
      $scope.getGames()
      $scope.allgames.gamename = null
      $scope.allgames.repeat = function(){
        return false;
      }
      $window.location = '#/games/' + game._id
  	})
  	.catch(function(){
  		console.log('this didnt work')
  	})
  },

  $scope.logout = function(){
    userService.logout()
    $window.location = '/login'
  }

  var getCurrentUser = function(){
    console.log(userData)
    $scope.user = userData;
  }

$scope.getGames()
getCurrentUser()

 }])
