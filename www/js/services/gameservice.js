angular.module('trivial.gamesrvc', [])

.factory('gameSrvc', ['$http', '$window', function ($http, $window) {
  return {

    createGame: function(name, limit) {
      return $http({
        method: 'POST',
        url: '/games',
        authorization: localStorage.getItem('satellizer_token'),
        data: {name: name, limit: limit}
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

    // This function doesnt seem to be used so is a candidate for deletion
    // getOneGame: function (gameId) {
    //    return $http({
    //       method: 'GET',
    //       authorization: localStorage.getItem('satellizer_token'),
    //       url: 'games/:gameid'
    //     }).then(function(resp) {
    //       console.log(resp.data)
    //       return resp.data;
    //     })
    //   },

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
        url: '/games/' + gameId + '/pins',
        authorization: localStorage.getItem('satellizer_token')
      }).then(function(resp){
        console.log('pins resp', resp.data)
        return resp.data
      })
    },

    joinGame: function(gameId) {
      return $http({
        method: 'PUT',
        url: '/games/' + gameId,
        authorization: localStorage.getItem("satellizer_token"),
        data: {game_id: gameId}
      }).then(function(resp) {
        console.log('JOINING GAME SUCCESSFUL', resp)
        return resp
      }).catch(function(err) {
        console.log('THROW NEW ERROR: ', err)
      })
    },

    claimPin: function(gameId,pinId) {
      console.log('claimPin called')
      return $http({
        method: 'PUT',
        url: '/games/' + gameId + '/pins/' + pinId,
        authorization: localStorage.getItem('satellizer_token')
      }).then(function(resp){
        console.log('Pin claimed', resp)
        return resp
      }).catch(function(err) {
        console.log('ERROR', err)
      })
    },

    addPin: function(pin, gameId) {
      console.log('this is the pin body', pin)
      return $http({
        method: 'POST',
        url: '/games/' + gameId + '/pins',
        authorization: localStorage.getItem('satellizer_token'),
        data: {
          address: pin.formatted_address,
          name: pin.name,
          coordinates: [pin.geometry.location.lat(), pin.geometry.location.lng()]
        }
      }).then(function(resp){
        console.log('server POST pin success', resp)
        return resp.data
      }).catch(function(err){
        console.log('response when over pin limit', err)
        alert('Pin not added, stop being greedy!!')
      })
    },

    deletePin: function(pinId, gameId) {
      return $http({
        method: 'DELETE',
        url: '/games/' + gameId + '/pins/' + pinId,
        authorization: localStorage.getItem('satellizer_token')
      })
      .then(function(res) {
        console.log('delete pin res', res)
        return res
      })
      .catch(function(err) {
        console.log('delete pin caught', err)
        console.log(pinId)
      })
    }

  }
}]);
