const express = require('express')
const router = require('express').Router();
const games = require('../controllers/gameController')
const pins = require('../controllers/pinsController')



//returns all games
router.get('/', games.getAllGames)
router.get('/:gameid', games.getOneGame)
router.post('/:gameid', games.createGame)

router.post('/:gameid/pins', pins.createNewPin)
router.delete('/:gameid/pins/:pinId', pins.deletePin)

module.exports = router;
