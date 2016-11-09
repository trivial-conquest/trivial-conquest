if(process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'development'

const express       = require('express')
const path          = require('path')
const bodyParser    = require('body-parser')
const logger        = require('morgan');
const cors          = require('cors');
const TokenService  = require('./config/TokenService');


const router = require('./routes/routes')
const games  = require('./routes/games')
const auth  = require('./routes/auth')

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

    req.isAuthenticated = token.isAuthenticated.bind(token);
    req.tokenPayload    = token.getPayload();
    req.user            = {
        _id: req.tokenPayload._id
    };


    next();
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      console.log('1')
      return next();
    }

    if(req.xhr) {
      console.log('2')
        // res.redirect('/')
        return res.status(401).send('Unauthorized');
    } else {
      console.log('3')
       // You can redirect to login page here aswell
       // res.redirect('/')
       return res.status(401).send('Unauthorized');
    }
}


app.use('/', router)
app.use('/games', isAuthenticated, games)
app.use('/auth', auth)


const port = process.env.PORT || 8080
// app level middleware

const server = app.listen(port)
console.log(`Server is running on port: ${port}`)
module.exports = app;
