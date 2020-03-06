let express = require('express');
let router = express.Router();
let uC = require('../controllers/user.controller');

router.post('/login',uC.login);
router.post('/register',uC.register);
router.use('/dashboard',require('./dashboard.route'));

module.exports = router;