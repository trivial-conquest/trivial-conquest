angular.module('trivial.gamesrvc', [])

.factory('gameSrvc', ['$http', '$window', function ($http, $window) {
  return {

    createGame: function(name, limit) {
      if(limit !==0){
      return $http({
        method: 'POST',
        url: '/games',
        authorization: localStorage.getItem('satellizer_token'),
        data: {name: name, limit: limit}
      }).then(function(resp){
        return resp.data
      }).catch(function(resp){
      })
    }
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

    getPlayerPoints: function (gameId) {
      return $http({
        method: 'GET',
        authorization: localStorage.getItem('satellizer_token'),
        url: '/games/' + gameId + '/points'
      }).then(function(resp){
        return resp.data
      })
    },

    getOneGame: function (gameId) {
       return $http({
          method: 'GET',
          authorization: localStorage.getItem('satellizer_token'),
          url: 'games/' + gameId
        }).then(function(resp) {
          return resp.data;
        })
      },

     getOnePin: function (pinId) {
     return $http({
        method: 'GET',
        authorization: localStorage.getItem('satellizer_token'),
        url: 'games/pins/' + pinId
      }).then(function(resp) {
        return resp.data;
      })
    },

    getPlayer: function (userId) {
      return $http({
        method: 'GET',
        authorization: localStorage.getItem('satellizer_token'),
        url: 'user/' + userId
      }).then(function(resp) {
        return resp.data;
      })
    },

    getPinsForGame: function(gameId) {
      return $http({
        method: 'GET',
        url: '/games/' + gameId + '/pins',
        authorization: localStorage.getItem('satellizer_token')
      }).then(function(resp){
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
        return resp
      }).catch(function(err) {
        console.log('THROW NEW ERROR: ', err)
      })
    },

    withDraw: function(points, gameId, pinId){
      console.log('this is withDraw gameid', gameId, 'pinId', pinId)
      return $http({
        method: 'PUT',
        url: '/games/' + gameId + '/pins/' + pinId + '/withdrawal',
        authorization: localStorage.getItem("satellizer_token"),
        data: {points: points}
      }).then(function(resp) {
        console.log('withDraw works', resp)
        return resp.data
      }).catch(function(err) {
        console.log('withdraw error: ', err)
      })
    },

     deposit: function(points, gameId, pinId){
      console.log('this is deposit gameid', gameId, 'pinId', pinId, "and points", points)
      return $http({
        method: 'PUT',
        url: '/games/' + gameId + '/pins/' + pinId + '/deposit',
        authorization: localStorage.getItem("satellizer_token"),
        data: {points: points}
      }).then(function(resp) {
        console.log('deposit works', resp)
        return resp.data
      }).catch(function(err) {
        console.log('deposit error: ', err)
      })
    },


    settleDispute: function(gameId,pinId,winnerId,loserId, newIcon) {
      console.log('settled dispute', gameId, pinId, winnerId, loserId)
      return $http({
        method: 'PUT',
        url: '/games/' + gameId + '/pins/' + pinId + '/settleDispute',
        authorization: localStorage.getItem('satellizer_token'),
        data: {loser: loserId, winner: winnerId, newIcon: newIcon}
      }).then(function(resp){
        console.log('Pin claimed', resp)
        return resp
      }).catch(function(err) {
        console.log('ERROR', err)
      })
    },

    addPin: function(pin, gameId, points) {
      var pinId;
      console.log('this is the pin body', pin, points)
      return $http({
        method: 'POST',
        url: '/games/' + gameId + '/pins',
        authorization: localStorage.getItem('satellizer_token'),
        data: {
          address: pin.formatted_address,
          name: pin.name,
          coordinates: [pin.geometry.location.lat(), pin.geometry.location.lng()],
          points: points
        }
      }).then(function(resp){
        console.log('server POST pin success resp for pinId', resp)
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
}}]);
