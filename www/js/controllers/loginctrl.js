angular.module('trivial.login', [])

.controller('LoginCtrl', ['$window', '$rootScope', '$scope', '$ionicModal', 'userService', function($window, $rootScope, $scope,  $ionicModal, userService) {

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.authenticate = function(provider) {
    userService.authenticate(provider);
  };

  $rootScope.$on('userLoggedIn', function(data){
    // here we will recieve the logged in user
    $scope.closeLogin();
    $window.location = "/"
  });

  // will fire in case authentication failed
  $rootScope.$on('userFailedLogin', function(){

  });


}]);
