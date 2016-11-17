angular.module('trivial.bank', [])

.controller('BankCtrl', ['$scope', '$ionicModal', '$location', 'gameSrvc', function($scope,  $ionicModal, $location, gameSrvc) {

  $scope.pinDeposited = false; 
  $scope.pinWithdrawn = false; 


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
    console.log('this is scoepwitrh', $scope.bank.pinwithdraw)
    gameSrvc.withDraw(Number($scope.bank.pinwithdraw), currentGameID, pinId)
    .then(function(pin){
      console.log('this is the withdraw stuff', pin)
      $scope.bank.pinworth = pin.points
      $scope.bank.pinwithdraw = null
      var madeWithdrawal = function(){
        $scope.pinWithdrawn = true; 
      }()
    })
    .catch(function(err){
      console.log('this is a withdraw err', err)
    })
  }

  $scope.deposit = function(){
    console.log('this is scoepwitrh', $scope.bank.pindeposit)
    gameSrvc.deposit(Number($scope.bank.pindeposit), currentGameID, pinId)
    .then(function(pin){
      console.log('this is the deposit stuff', pin)
      $scope.bank.pinworth = pin.points
      $scope.bank.pindeposit = null 
      var madeDeposit = function(){
        $scope.pinDeposited = true; 
      }()
    })
    .catch(function(err){
      console.log('this is a deposit err', err)
    })
  }
 

  goBack()
 
 
}]);
