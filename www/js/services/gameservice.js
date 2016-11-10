angular.module('trivial.gamesrvc', [])

.factory('gameSrvc', ['$http', '$window', function ($http, $window) {
  return {

    createGame: function(name, limit) {
      return $http({
        method: 'POST',
        url: '/games/game',
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
        url: '/games/' + gameId + '/pins',
        authorization: localStorage.getItem('satellizer_token')
      }).then(function(resp){
        console.log('pins resp', resp)
        return resp.data
      })
    },

    joinGame: function(gameId) {
      return $http({
        method: 'PUT',
        url: '/games/:gameid',
        authorization: localStorage.getItem("satellizer_token"),
        data: {game_id: gameId}
      }).then(function(resp) {
        console.log('JOINING GAME SUCCESSFUL')
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
      }).catch(function(err) {
        console.log('ERROR', err)
      })
    },

    addPin: function(pin, gameId) {
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
        console.log('server POST pin success')
        return resp.data
      }).catch(function(resp){
        console.log('server POST pin failed', resp)
          $window.location = '/'
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
      })
      .catch(function(err) {
        // $window.location = '/'
        console.log('delete pin caught', err)
        console.log(pinId)
      })
    }

    // addGame: function (Msg, Img) {
    //   return $http({
    //     method: 'GET',
    //     url: '/sessions'
    //   }).then(function(resp){
    //     var userId = resp.data[0].userId
    //     return $http({
    //       method: 'POST',
    //       url: '/user',
    //       data: {userId: userId}
    //     })
    //   }).then(function(resp){
    //     console.log('this is resp data', resp.data[0])
    //     var firstName = resp.data[0].firstName
    //     var lastName = resp.data[0].lastName
    //     var avatar = resp.data[0].photolink
    //     return $http({
    //       method: 'POST',
    //       url: '/messages',
    //       data: {firstName: firstName, lastName: lastName, photolink: avatar, content: Msg, msgImageUrl: Img }
    //     })
    //   })
    // },
  }
}]);
