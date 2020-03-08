let express = require('express');
let router = express.Router();
let nC = require('../controllers/notification.controller');
let auth = require('../jwt');

router.get('/getNotifications',auth.verifyToken,nC.getNotifications);
router.post('/removeNotification',auth.verifyToken,nC.remove);
router.post('/acceptNotification',auth.verifyToken,nC.remove);

module.exports = router;