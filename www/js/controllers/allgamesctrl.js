angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', 'gameSrvc', function($scope, $stateParams, gameSrvc) {
 //will need to pull all games fom the server and attach them to scope variable
 
  $scope.createGame = function(){
  	gameSrvc.createGame()
  	.then(function(){
  	  console.log('this worked')
  	})
  	.catch(function(){
  		console.log('this didnt work')
  	})
  }




   $scope.games= [{name: 'munchybreakfast', id:1}, {name: "settlersof6", id:2}]
 }])