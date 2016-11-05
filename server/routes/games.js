const express = require('express')
const router = require('express').Router();
const games = require('../controllers/gameController')



//returns all games
router.get('/', games.getAllGames)
router.get('/:gameid', games.getOneGame)
router.post('/:gameid', games.createGame)



module.exports = router;