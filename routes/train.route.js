let express = require('express');
let router = express.Router();
let tC = require('../controllers/train.controller');

router.post('/createTrain',tC.createTrain);
router.get('/getAllTrains',tC.getAllTrains);
router.get('/getTrain',tC.getTrain);
router.post('/updateTrainLocation',tC.updateTrainLocation);

module.exports = router;