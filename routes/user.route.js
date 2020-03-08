let express = require('express');
let router = express.Router();
let uC = require('../controllers/user.controller');
let auth = require('../jwt');

router.post('/login',uC.login);
router.post('/register',uC.register);
router.post('/makeTC',uC.makeTC);
router.get('/viewProfile',auth.verifyToken,uC.getProfile);

module.exports = router;