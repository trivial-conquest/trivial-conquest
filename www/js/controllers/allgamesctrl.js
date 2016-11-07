angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', 'gameSrvc', '$window', function($scope, $stateParams, gameSrvc, $window) {
 //will need to pull all games fom the server and attach them to scope variable
 
 $scope.getGames = function(){
 	  gameSrvc.getAllGames()
 	  .then(function(games){
 	  	console.log('all games retrieved', games)
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
  }

// $scope.games= [{name: 'Bens Game', id:'5820e90a30f1ee11c82baf6b', pins:[
//         {lat: 30.272890, lng: -97.743110},
//         {lat: 30.267824, lng: -97.745451},
//         {lat: 30.265921, lng: -97.746274},
//         {lat: 30.268936, lng: -97.740065}
//       ]}, {name: "settlersof6", id:2, pins:[
//         {lat: 30.272890, lng: -97.743110},
//         {lat: 30.267824, lng: -97.745451}
//       ]}]

$scope.getGames()
}]);