const express = require('express')
const router = require('express').Router();
const user = require('../controllers/userController')


router.get('/:userid', user.getOne)

module.exports = router;