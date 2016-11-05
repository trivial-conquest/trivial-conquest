const express = require('express')
const path = require('path')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')
const AuthModule    = require('./config/AuthModule');  
const TokenService  = require('./config/TokenService');  
const authCtrl      = require('./config/auth.ctrl');
 

const router = require('./routes/routes')
const games = require('./routes/games')

const app = express()
const port = process.env.PORT || 8080
// app level middleware
app.use(express.static(path.resolve(__dirname, '../www')))
app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/auth/facebook',  
//     authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
//     res.json({token: req.generatedToken});
// });

router.post('/auth/facebook', (req,res) => {
	console.log('this is the body', req.body)
})

app.use('/', router)
app.use('/games', games)

const server = app.listen(port)
console.log(`Server is running on port: ${port}`)
