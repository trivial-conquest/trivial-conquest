angular.module('trivial.bank', [])

.controller('BankCtrl', ['$scope', '$ionicModal', '$location', 'gameSrvc', function($scope,  $ionicModal, $location, gameSrvc) {


  $scope.users = []
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/score.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
    return $location.$$url.replace('/games/','').replace('/bank', '')
  }

  var currentGameID = getCurrentGameID();

  var goBack = function(){
    $scope.goBack = {url: "#/games/" + currentGameID}
    console.log("this is in goBack",  $scope.goBack.url)
    return  $scope.goBack
  }

 

  goBack()
 
 
}]);
