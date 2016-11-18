angular.module('trivial.games', [])

.controller('GamesCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$location', 'gameSrvc', 'userService', '$window', '$auth', function($scope, $stateParams, $cordovaGeolocation, $location, gameSrvc, userService, $window, $auth) {
 //will need to pull all games fom the server and attach them to $scope.game
  var userData = $auth.getPayload();
  var closestPin;

  $scope.logout = function(){
    userService.logout()
    $window.location = '/#/login'
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
      var originalCenter = map.getCenter()

              // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

       var pointInput = document.getElementById('points');
          var div = document.createElement('div');
          pointInput.appendChild(div);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(pointInput)

      var pinButton = document.getElementById('pinbtn');
        var pindiv = document.createElement('div');
        pointInput.appendChild(div)

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(pinButton)

      var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
      var pinToAdd;
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        pinToAdd = places[0];
        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        // markers.forEach(function(marker) {
        //   marker.setMap(null);
        // });
        // markers = [];

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
        // draggable:true,
        animation: google.maps.Animation.BOUNCE,
        icon: './img/youAreHere.png'
      });

      youMarker.addListener('click', function() {
        gameSrvc.getPlayerPoints(currentGameID)
        .then(function(response){
          var youPoints = response[0].points
          var infowindow = new google.maps.InfoWindow({
          content: youPoints.toString()
        });
        infowindow.open(map, youMarker);
        })
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

        var newPin = new google.maps.Marker({
            position: coordinatesObj,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image
          });

        newPin.addListener('click', function() {
          gameSrvc.getPinsForGame(currentGameID)
          .then(function(response){
            console.log('res on click', response)
            var currPoints = response.filter(function(pin){
              return pin._id == pinObj._id
          }).map(function(obj){
            return obj.points
          })
          console.log('currPoints', currPoints)
          var infowindow = new google.maps.InfoWindow({
            content: currPoints.toString()
          });
            infowindow.open(map, newPin);
          })
        });

        window.setTimeout(function() {
          markers.push(newPin);
        }, timeout);
      }

      var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
        return $location.$$url.replace('/games/','')
      }

      var currentGameID = getCurrentGameID();
      var scoreRedirect = function(){
        $scope.scoreUrl = {url: "#/games/" + currentGameID + "/score"}
        return  $scope.scoreUrl
      }

      scoreRedirect()

       var bankRedirect = function(pinId){
        $scope.bankUrl = {url: "#/games/" + currentGameID + "/pin/" + pinId +"/bank"}
        return  $scope.bankUrl
      }


      gameSrvc.getPinsForGame(currentGameID) //Getting pins for the game we are currently in
      .then(function(response){
        pins = response
        console.log('GPFGR', response)
        drop(pins) //Placing pins on the map from the game we are currently in
      })

      var markers = [];

      function drop(pins, timeout) {
        // console.log('drop called')
        // clearMarkers();
        for (var i = 0; i < pins.length; i++) {
          addMarkerWithTimeout(pins[i], i * 100);
        }
      }

      $scope.claimPin = function() {
        var myCoords = {lat: position.coords.latitude, lng: position.coords.longitude}
        //Checks to see if user is close enough to any pins in the game
        var closePins = pins.filter(function(pin){
          return (Math.abs(myCoords.lat - pin.coordinates[0]) < .003 && Math.abs(myCoords.lng - pin.coordinates[1]) < .003 && pin.owner !== userData._id)
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
          gameSrvc.getPlayerPoints(closest.game)
          .then(function(gameRes){
            //gameRes gives you the amount of points the user has in this game
            var pinPoints = closest.points
            var userPoints = gameRes[0].points
            var outcome = (Math.random() * (pinPoints + userPoints))
            if(outcome < userPoints) {
              alert('Victory is yours!')
              //Takes a winner first and then a loser, so in this case the user wins
              gameSrvc.settleDispute(closest.game, closest._id, gameRes[0].user, closest.owner, userData.profilePicture)
              .then(function(){
                gameSrvc.getPinsForGame(currentGameID)
                .then(function(){
                  drop(pins)
                })
              })
            } else {
              alert('You lose sucka!')

              //In this case, the pin owner is the winner and the user is the loser
              gameSrvc.settleDispute(closest.game, closest._id, closest.owner, gameRes[0].user)
              return
            }
          })
        }
      }

    //This function checks a user's pins in one game to determine delete button render
    $scope.checkUserPins = function() {
      var myUser = userData._id
      var userPins = pins.filter(function(pin) {
        return pin.creator == myUser
      })
      if(userPins.length > 0 && userPins.length < 3) { return true }
      else if(userPins.length === 0) { return false }
      else if(userPins.length === 3) { return false }
    }

    $scope.checkPinCount = function() {
      var myUser = userData._id
      var userPins = pins.filter(function(pin) {
        return pin.creator == myUser
      })
      if(userPins.length === 3) { return false}
      else { return true }
    }

    //This function checks user location to determine claim button rendering
    $scope.checkLocation = function() {
      var myCoords = {lat: position.coords.latitude, lng: position.coords.longitude}
      var closePins = pins.filter(function(pin){
          return (Math.abs(myCoords.lat - pin.coordinates[0]) < .003 && Math.abs(myCoords.lng - pin.coordinates[1]) < .003 && pin.owner !== userData._id)
        })
      if(closePins.length) {
        return true
      } else return false
    }

    $scope.checkLocOwner = function() {
      var myCoords = {lat: position.coords.latitude, lng: position.coords.longitude}
      var closePins = pins.filter(function(pin){
        return (Math.abs(myCoords.lat - pin.coordinates[0]) < .003 && Math.abs(myCoords.lng - pin.coordinates[1]) < .003)
      })
      if(closePins.length && closePins[0].owner === userData._id) {
        bankRedirect(closePins[0]._id)
        return true
      } else return false
    }

    $scope.joinGame = function() {
      console.log('this is joingame', currentGameID)
       gameSrvc.joinGame(currentGameID)
       .then(function(){
        console.log('this worked', currentGameID)
       })
       .catch(function(){
        console.log('this doesnt work')
       })
    }

      $scope.addPin = function() {
        gameSrvc.addPin(pinToAdd, currentGameID, $scope.onegame.points)
        .then(function(pin) {
          console.log('this is pin', pin)
          $scope.onegame.points = null
          $scope.onegame.search = null
          gameSrvc.getPinsForGame(currentGameID) //Getting pins for the game we are currently in
          .then(function(response){
            pins = response;
            map.setCenter(originalCenter)
            map.setZoom(15)
            drop(pins) //Placing pins on the map from the game we are currently in
          })
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
          gameSrvc.getPinsForGame(currentGameID)
          .then(function(response){
            pins = response
            // map.setCenter(originalCenter)
            // map.setZoom(15)
            console.log('markers', markers)
            // markers[markers.length - 1].setMap(null)
            markers.forEach(function(marker) {
              marker.setMap(null);
            })
            drop(pins)
          })
        })
      }

      // Init variable and point at game object to access each game's props
      var gameData ;
      gameSrvc.getOneGame(currentGameID)
      .then(function(game) {
        gameData = game
      })

      // This function checks if user has already joined game to determind joinGame render
      $scope.checkUserJoin = function() {
        var myUser = userData._id
        console.log('myUser: ', myUser)
        var users = gameData[0].users
        console.log('users: ', users)
        var bool = true
        users.forEach(function(user){
          if(user._id === myUser) {
            console.log("myUser has already joined - button should be hidden")
            bool = false }
        })
       return bool
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
