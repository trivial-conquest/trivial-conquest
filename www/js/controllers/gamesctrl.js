angular.module('trivial.games', [])

.controller('GamesCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$location', 'gameSrvc', 'userService', function($scope, $stateParams, $cordovaGeolocation, $location, gameSrvc, userService) {
 //will need to pull all games fom the server and attach them to $scope.game

  $scope.logout = function(){
    userService.logout()
    $window.location = '/login'
  }

  var pins = [];
  var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position){
      console.log(position)
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
      var pinToAdd;
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        console.log('places[0] =', places[0])
        pinToAdd = places[0];
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

      // google.maps.event.addListener(map, 'click', function(event) {
      //   placeMarker(event.latLng);
      // });

      // function placeMarker(location) {
      //   var marker = new google.maps.Marker({
      //     position: location,
      //     map: map
      //   });
      //   map.panTo(location);
      // }

      //drawingManager.setMap(map);

      function addMarkerWithTimeout(pinObj, timeout) {
        var coordinatesObj = {}
        var image = pinObj.icon.replace('large', 'small') //Changing from large fb pic to small
        //Formatting coordinates so that the API can recognize them
        coordinatesObj.lat = pinObj.coordinates[0]
        coordinatesObj.lng = pinObj.coordinates[1]

      function addMarkerWithTimeout(position, timeout) {
        window.setTimeout(function() {
          markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
          }));
        }, timeout);
      }

      var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
        console.log('game url', $location.$$url.replace('/games/',''))
        return $location.$$url.replace('/games/','')
      }

      var currentGameID = getCurrentGameID();

      gameSrvc.getPinsForGame(currentGameID) //Getting pins for the game we are currently in
      .then(function(response){
        pins = response
        console.log('GPFGR', response)
        drop(pins) //Placing pins on the map from the game we are currently in
      })

      var markers = [];

      function drop(pins) {
        for (var i = 0; i < pins.length; i++) {
          console.log('DROP', {lat: pins[i].coordinates[0]})
          addMarkerWithTimeout({lat: pins[i].coordinates[0], lng: pins[i].coordinates[1]}, i * 100);
        }
      }

      $scope.claimPin = function() {
        var myCoords = {lat: position.coords.latitude, lng: position.coords.longitude}
        //Checks to see if user is close enough to any pins in the game
        var closePins = pins.filter(function(pin){
          return (Math.abs(myCoords.lat - pin.coordinates[0].lat) < .003 && Math.abs(myCoords.lng - pin.coordinates[0].lng) < .003)
        })
        //If use is close enough to a pin to claim it, find the one that they are closest to
        if (closePins.length) {
          var closest = closePins.reduce(function(min, next){
            if (Math.abs(myCoords.lat - next.lat) + Math.abs(myCoords.lng - next.lng) < Math.abs(myCoords.lat - min.lat) + Math.abs(myCoords.lng - min.lng)) {
              return next
            } else {
              return min
            }
          })
          gameSrvc.claimPin(closest.game, closest._id)
          alert('You claimed a pin at latitude ' + closest.coordinates[0].lat + ' and longitude ' + closest.coordinates[0].lng )
          return
        }
        alert('Sorry, too far')
      }

    $scope.joinGame = function(currentGameID) {
       gameSrvc.joinGame()
       .then(function(){
        console.log('this worked')
       })
       .catch(function(){
        console.log('this doesnt work')
       })
    }

      $scope.addPin = function() {
        console.log('pincoords', pinToAdd.geometry.location.lat(), pinToAdd.geometry.location.lng())
        gameSrvc.addPin(pinToAdd, currentGameID)
        .then(function(pin) {
          console.log('POSTED pin')
        })
        .catch(function(err) {
          console.log('POST pin failed', err)
        })
      },

      $scope.deletePin = function() {
        // DELETE pin from db
        var pinToDelete;
        gameSrvc.getPinsForGame(currentGameID)
        .then(function(response){
          pinToDelete = response[response.length - 1]
          gameSrvc.deletePin(pinToDelete._id, currentGameID)
          location.reload()
        })
      }

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
