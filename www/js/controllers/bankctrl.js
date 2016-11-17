angular.module('trivial.bank', [])

.controller('BankCtrl', ['$scope', '$ionicModal', '$location', 'gameSrvc', 'userService', function($scope,  $ionicModal, $location, gameSrvc, userService) {

  $scope.currentUser = userService.getUser()
  console.log('this is the currentUser in BankCtrl', $scope.currentUser)
  
  $scope.users = []
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/score.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  var getCurrentGameID = function(){ //Getting game ID based on URL in order to look up that game's pins
    var gameid = $location.$$url.replace('/games/','').split('/pin/')[0]
    return gameid
  }

   var getPinId = function(){ //Getting game ID based on URL in order to look up that game's pins
    var pinid = $location.$$url.replace('/games/','').split('/pin/')[1].replace('/bank', '')
    return pinid
  }

  var currentGameID = getCurrentGameID();
  var pinId = getPinId()

  var goBack = function(){
    $scope.goBack = {url: "#/games/" + currentGameID}
    return  $scope.goBack
  }

  $scope.withdraw = function(){
    gameSrvc.withDraw(Number($scope.bank.pinwithdraw), currentGameID, pinId)
    .then(function(pin){
      $scope.bank.pinworth = pin.points
      $scope.bank.pinwithdraw = null
      currentGame()
      currentPin()
    })
    .catch(function(err){
      console.log('this is a withdraw err', err)
    })
  }

  $scope.deposit = function(){
    gameSrvc.deposit(Number($scope.bank.pindeposit), currentGameID, pinId)
    .then(function(pin){
      $scope.bank.pinworth = pin.points
      $scope.bank.pindeposit = null 
      currentGame()
      currentPin()
    })
    .catch(function(err){
      console.log('this is a deposit err', err)
    })
  }

  var currentGame = function(){
    gameSrvc.getOneGame(currentGameID)
    .then(function(game){
      game[0].scoreboard.forEach(function(board){
        if(board.user === $scope.currentUser._id){
          $scope.userPoints = board.points
          return board
        }
      })
    })
  }

  var currentPin = function(){
    gameSrvc.getOnePin(pinId)
    .then(function(pin){
      $scope.pin = pin
      console.log('cp', pin)
      return pin
    })
  }

  currentGame()
  currentPin()
  goBack()
}]);
