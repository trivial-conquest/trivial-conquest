angular.module('trivial.score', [])

.controller('ScoreCtrl', ['$window', '$rootScope', '$scope', '$ionicModal', '$location', function($window, $rootScope, $scope,  $ionicModal, $location) {


  $scope.users = [{firstName: "Christina", lastName: "Mullen", profilePicture: "https://graph.facebook.com/1844772705756251/picture?type=small", 
  points: 13808302}, {firstName: "Anon", lastName: "Ymous", profilePicture: "https://graph.facebook.com/1844772705756259/picture?type=small", 
  points: 12}]
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/score.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
    return $location.$$url.replace('/games/','').replace('/score', '')
  }

  var currentGameID = getCurrentGameID();

  var goBack = function(){
    $scope.goBack = {url: "#/games/" + currentGameID}
    console.log("this is in scorered",  $scope.goBack)
    return  $scope.goBack
  }

  goBack()

 
}]);
