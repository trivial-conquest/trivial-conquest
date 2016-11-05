angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
 //will need to pull all games fom the server and attach them to scope variable
 $stateParams.gameId =1
  $scope.games= [{name: 'munchybreakfast', id:1}, {name: "settlersof6", id:2}]
}]);