const express = require('express')
const router = require('express').Router();
const games = require('../controllers/gameController')
const pins = require('../controllers/pinsController')



//returns all games
router.get('/', games.getAllGames)
router.post('/', games.createGame)
router.get('/:gameid', games.getPlayerPoints)
router.put('/:gameid', games.joinGame, games.getOneGame)

router.post('/:gameid/pins', pins.createNewPin)
router.delete('/:gameid/pins/:pinId', pins.deletePin)
router.put('/:gameid/pins/:pinId', pins.updatePinOwner)
router.put('/:gameid/pins/:pinId/withdrawal', pins.withdrawal)
router.put('/:gameid/pins/:pinId/deposit', pins.deposit)
router.put('/:gameid/pins/:pinId/settleDispute', pins.settleDispute)
router.get('/:gameid/pins', pins.getPinsForGame)

module.exports = router;
