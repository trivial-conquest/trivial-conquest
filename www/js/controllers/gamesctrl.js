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
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        draggable:true,
        animation: google.maps.Animation.BOUNCE,
        // maybe we can use the user's facebook photo for the icon
        icon: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgwMzQ4ODYxMV5BMl5BanBnXkFtZTcwNDAwMTc2NQ@@._V1._SX20_SY32_.jpg',
        // also possible to add a text title on top of marker
        // label: 'YOUR LOCATION'
      });

      google.maps.event.addListener(marker , 'click', function(){
          var infowindow = new google.maps.InfoWindow({
            content:'Maybe we can use a title?',
            position: latLng,
          });
          infowindow.open(map);
      });

    })
    .catch(function(error){
    console.log("Could not get location", error);
  });


// // add multiple pins at once ???
 // var neighborhoods = [
 //        {lat: 52.511, lng: 13.447},
 //        {lat: 52.549, lng: 13.422},
 //        {lat: 52.497, lng: 13.396},
 //        {lat: 52.517, lng: 13.394}
 //      ];

 //      var markers = [];
 //      var map;


 //      function drop() {
 //        clearMarkers();
 //        for (var i = 0; i < neighborhoods.length; i++) {
 //          addMarkerWithTimeout(neighborhoods[i], i * 200);
 //        }
 //      }

 //      function addMarkerWithTimeout(position, timeout) {
 //        window.setTimeout(function() {
 //          markers.push(new google.maps.Marker({
 //            position: position,
 //            map: map,
 //            animation: google.maps.Animation.DROP
 //          }));
 //        }, timeout);
 //      }

 //      function clearMarkers() {
 //        for (var i = 0; i < markers.length; i++) {
 //          markers[i].setMap(null);
 //        }
 //        markers = [];
 //      }



}]);







