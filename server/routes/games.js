const express = require('express')
const router = require('express').Router();
const games = require('../controllers/gameController')
const pins = require('../controllers/pinsController')



//returns all games
router.get('/', games.getAllGames)
router.get('/:gameid', games.getOneGame)
router.post('/game', games.createGame)
// router.put('/:gameid', games.addPlayer)

router.post('/:gameid/pins', pins.createNewPin)
router.delete('/:gameid/pins/:pinId', pins.deletePin)
router.put('/:gameid/pins/:pinId', pins.updatePinOwner)

module.exports = router;
