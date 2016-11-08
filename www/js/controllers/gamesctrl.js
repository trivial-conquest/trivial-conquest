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

              // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

          // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
          map.fitBounds(bounds);
      });

      var youMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        draggable:true,
        animation: google.maps.Animation.BOUNCE,
        // maybe we can use the user's facebook photo for the icon
        icon: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgwMzQ4ODYxMV5BMl5BanBnXkFtZTcwNDAwMTc2NQ@@._V1._SX20_SY32_.jpg',
        // also possible to add a text title on top of marker
        // label: 'YOUR LOCATION'
      });

      google.maps.event.addListener(youMarker , 'click', function(){
        var infowindow = new google.maps.InfoWindow({
          content:'Maybe we can use a title?',
          position: latLng,
        });
        infowindow.open(map);
      });

      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
      });

      function placeMarker(location) {
        var marker = new google.maps.Marker({
          position: location, 
          map: map
        });
        map.panTo(location);  
      }

      var pins = $scope.game.pins

      var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
        console.log($location.$$url.replace('/games/',''))
        return $location.$$url.replace('/games/','')
      }

      var currentGameID = getCurrentGameID();


      var gamePins = [];

      function drop() {
        cleargamePins();
        for (var i = 0; i < pins.length; i++) {
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
          gamePins.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          }));
        }, timeout);
      }



      function cleargamePins() {
        for (var i = 0; i < gamePins.length; i++) {
          gamePins[i].setMap(null);
        }
        gamePins = [];
      }

      drop()

    })

    .catch(function(error){
    console.log("Could not get location", error);
  });

}]);

// THIS IS THE OLD DRAWING LIBRARY 
//  var drawingManager = new google.maps.drawing.DrawingManager({
//   drawingMode: google.maps.drawing.OverlayType.MARKER,
//   drawingControl: true,
//   drawingControlOptions: {
//     position: google.maps.ControlPosition.TOP_CENTER,
//     drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
//   },
//   markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
//   circleOptions: {
//     fillColor: '#ffff00',
//     fillOpacity: 1,
//     strokeWeight: 5,
//     clickable: false,
//     editable: true,
//     zIndex: 1
//   }
// });

// drawingManager.setMap(map);
