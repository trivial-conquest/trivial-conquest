angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', 'gameSrvc', '$window', 'userService', function($scope, $stateParams, gameSrvc, $window, userService) {
 //will need to pull all games fom the server and attach them to scope variable

 $scope.create = false;

 $scope.getGames = function(){
 	  gameSrvc.getAllGames()
 	  .then(function(games){
 	  	console.log('all games retrieved', typeof(games))
      if(typeof(games) === 'string') $window.location = '/'
 	  	$scope.games = games
 	  })
 	  .catch(function(){
 	  	console.log('no games retrieved')
 	  })
 }

  $scope.createGame = function(name){
  	console.log('this is inside createGmae', name)
  	gameSrvc.createGame(name)
  	.then(function(game){
  		console.log("$$$$%%%^^#", game._id)
  	  $scope.getGames()
      $window.location = '#/games/' + game._id
  	})
  	.catch(function(){
  		console.log('this didnt work')
  	})
  },

  $scope.logout = function(){
    userService.logout()
    $window.location = '/'

  }



$scope.getGames()

   // $scope.games= [{name: 'munchybreakfast', id:1}, {name: "settlersof6", id:2}]
 }])
