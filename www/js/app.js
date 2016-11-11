// angular.module is a global place for creating, registering and retrieving Angular modules
// 'trivial' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires' which will include all the angular modules you create
angular.module('trivial', ['ionic', 'trivial.login', 'trivial.games', 'trivial.allgames', 'trivial.gamesrvc', 'ngCordova', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function( $stateProvider, $urlRouterProvider, $authProvider) {
  var commonConfig = {
  popupOptions: {
      location: 'no',
      toolbar: 'yes',
      width: window.screen.width,
      height: window.screen.height
  }
  };

  if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    commonConfig.redirectUri = 'http://localhost:8080/';
    //  commonConfig.redirectUri = 'https://intense-journey-25938.herokuapp.com/auth/facebook';
  }
  $authProvider.facebook(angular.extend({}, commonConfig, {
  clientId: '535661349967737',
  url: 'http://localhost:8080/auth/facebook'
  // url: 'https://intense-journey-25938.herokuapp.com/auth/facebook'
  }));



  //This is where you declare your routes and their corresponding views & controllers
  //The views will change when the frontend angular routes change which is usually done with a click/mouse event
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
     .state('allgames', {
    url: '/',
    templateUrl: 'templates/allgames.html',
    controller: 'AllGamesCtrl as allgames'
  })
     .state('games', {
    url: '/games/:gameId',
    templateUrl: 'templates/games.html',
    controller: 'GamesCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
