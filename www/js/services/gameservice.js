angular.module('trivial.gamesrvc', [])

.factory('gameSrvc', ['$http', function ($http) {
  return {

    createGame: function(name) {
      return $http({
        method: 'POST',
        url: '/games/game',
        authorization: localStorage.getItem('satellizer_token'),
        data: {name: name}
      }).then(function(resp){
        console.log('this game creation worked!!!!&&', resp.data)
        return resp.data
      }).catch(function(resp){
        console.log('this game creation didnt work', resp)
      })
    },

    getAllGames: function () {
      return $http({
        method: 'GET',
        authorization: localStorage.getItem('satellizer_token'),
        url: '/games'
      }).then(function(resp) {
        return resp.data;
      }).catch(function(err){

      })
    },

    getOneGame: function (gameId) {
       return $http({
          method: 'GET',
          authorization: localStorage.getItem('satellizer_token'),
          url: 'games/:gameid'
        }).then(function(resp) {
          console.log(resp.data)
          return resp.data;
        })
      },

    getQuestion: function() {
      return $http({
        method: 'GET',
        url: '/trivia',
      }).then(function(resp){
        console.log(resp.data.results);
        return resp.data.results
      })
    },

    getPinsForGame: function(gameId) {
      return $http({
        method: 'GET',
        url: '/games/' + gameId + '/pins'
      }).then(function(resp){
        return resp.data
      })
    }

    joinGame: function() {
      return $http({
        method: 'PUT',
        url: '/games/:gameid',
        data: {token: localStorage.getItem("satellizer_token")}
      }).then(function(resp) {
        console.log('JOINING GAME SUCCESSFUL')
      }).catch(function(err) {
        console.log('THROW NEW ERROR: ', err)
      })
    }

  }
}]);
