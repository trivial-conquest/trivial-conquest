const authCtrl      = require('../config/auth.ctrl');
const router = require('express').Router();

//Connect controller methods to their corresponding routes
router.post('/facebook',
    authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
    res.json({token: req.generatedToken});
});


module.exports = router;
