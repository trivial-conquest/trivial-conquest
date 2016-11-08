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
