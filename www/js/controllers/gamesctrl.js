angular.module('trivial.games', [])

.controller('GamesCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$location', function($scope, $stateParams, $cordovaGeolocation, $location) {
 //will need to pull all games fom the server and attach them to $scope.games

  $scope.game= {name: 'munchybreakfast', id:1, pins:[
        {lat: 30.272890, lng: -97.743110},
        {lat: 30.267824, lng: -97.745451},
        {lat: 30.265921, lng: -97.746274},
        {lat: 30.268936, lng: -97.740065}
      ]}

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

      var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
      },
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });

      drawingManager.setMap(map);

      var pins = $scope.game.pins

      var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
        console.log($location.$$url.replace('/games/',''))
        return $location.$$url.replace('/games/','')
      }

      var currentGameID = getCurrentGameID();


      var markers = [];

      function drop() {
        // console.log('drop called')
        // clearMarkers();
        for (var i = 0; i < pins.length; i++) {
          // console.log(pins[i])
          addMarkerWithTimeout(pins[i], i * 400);
        }
      }

      $scope.claimPin = function() {
        var myCoords = {lat: position.coords.latitude, lng: position.coords.longitude}
        console.log('myCoords', myCoords)
        for(i=0; i< $scope.game.pins.length; i++) {
          if (Math.abs(myCoords.lat - $scope.game.pins[i].lat) < .003 && Math.abs(myCoords.lng - $scope.game.pins[i].lng) < .003) {
            alert('You claimed a pin at latitude  ' + $scope.game.pins[i].lat + ' and longitude  ' + $scope.game.pins[i].lng)
            return
          }
        }
      }

      function addMarkerWithTimeout(position, timeout) {
        window.setTimeout(function() {
          markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          }));
        }, timeout);
      }

      // function clearMarkers() {
      //   for (var i = 0; i < markers.length; i++) {
      //     markers[i].setMap(null);
      //   }
      //   markers = [];
      // }

      drop()

    })
    .catch(function(error){
    console.log("Could not get location", error);
    });

}]);
