angular.module('trivial.allgames', [])

.controller('AllGamesCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
 //will need to pull all games fom the server and attach them to scope variable
 
  $scope.games= [{name: 'Bens Game', id:'5820e90a30f1ee11c82baf6b', pins:[
        {lat: 30.272890, lng: -97.743110},
        {lat: 30.267824, lng: -97.745451},
        {lat: 30.265921, lng: -97.746274},
        {lat: 30.268936, lng: -97.740065}
      ]}, {name: "settlersof6", id:2, pins:[
        {lat: 30.272890, lng: -97.743110},
        {lat: 30.267824, lng: -97.745451}
      ]}]
}]);