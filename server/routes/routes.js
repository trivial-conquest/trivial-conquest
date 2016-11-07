const users = require('../controllers/userController')
const router = require('express').Router();

//Connect controller methods to their corresponding routes

router.post('/sign-up', users.post);

router.get('/', (req,res) => {
  res.render(path.resolve(__dirname, '../../www/index.html'))
})




module.exports = router;
