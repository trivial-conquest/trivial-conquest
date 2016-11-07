const express       = require('express')
const path          = require('path')
// const cookie        = require('cookie-parser')
const bodyParser    = require('body-parser')
const logger        = require('morgan');
const dotenv        = require('dotenv');
const cors          = require('cors');

/**
* Load app modules and routes
*/
const AuthModule    = require('./config/AuthModule');
const TokenService  = require('./config/TokenService');
const authCtrl      = require('./config/auth.ctrl');

const app = express()

app.use(express.static(path.resolve(__dirname, '../www')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cors({
  origin: '*',
  withCredentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin' ]
}));

app.use((req, res, next) => {
    const token = new TokenService(req.headers);

    req.isAuthenticated = token.isAuthenticated;
    req.tokenPayload    = token.getPayload();
    req.user            = {
        _id: req.tokenPayload._id
    };

    next();
});

const router = require('./routes/routes')
const games  = require('./routes/games')

app.use('/', router)
app.use('/games', games)

app.post('/auth/facebook',
    authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
    console.log('MONEY: ', req.generatedToken)
    res.json({token: req.generatedToken});
});

dotenv.load({ path: 'fb.js' });

const port = process.env.PORT || 8080
// app level middleware

const server = app.listen(port)
console.log(`Server is running on port: ${port}`)