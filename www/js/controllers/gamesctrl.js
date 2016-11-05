angular.module('trivial.games', [])

.controller('GamesCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', function($scope, $stateParams, $cordovaGeolocation) {
 //will need to pull all games fom the server and attach them to $scope.games

  $scope.games= [{name: 'munchybreakfast', id:1}, {name: "settlersof6", id:2}]

var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options)
  .then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  })
  .catch(function(error){
  console.log("Could not get location", error);
  });

}]);