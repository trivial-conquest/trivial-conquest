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
    var gameid = $location.$$url.replace('/games/','').split('/pin/')[0]
    console.log('this is gameid', gameid)
    return gameid
  }

   var getPinId = function(){ //Getting game ID based on URL in order to look up that game's pins
    var pinid = $location.$$url.replace('/games/','').split('/pin/')[1].replace('/bank', '')
    console.log('this is pinid', pinid)
    return pinid
  }

  var currentGameID = getCurrentGameID();
  var pinId = getPinId()

  var goBack = function(){
    $scope.goBack = {url: "#/games/" + currentGameID}
    console.log("this is in goBack",  $scope.goBack.url)
    return  $scope.goBack
  }

  $scope.withdraw = function(){
    gameSrvc.withDraw($scope.pinwithdraw, currentGameID, pinId)
    .then(function(stuff){
      console.log('this is the withdraw stuff', stuff)
    })
    .catch(function(err){
      console.log('this is a withdraw err', err)
    })
  }

  $scope.deposit = function(){
    gameSrvc.deposit($scope.pindeposit, currentGameID, pinId)
    .then(function(stuff){
      console.log('this is the deposit stuff', stuff)
    })
    .catch(function(err){
      console.log('this is a deposit err', err)
    })
  }
 

  goBack()
 
 
}]);
