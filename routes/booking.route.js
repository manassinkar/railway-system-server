let express = require('express');
let router = express.Router();
let bC = require('../controllers/booking.controller');
let auth = require('../jwt');

router.post('/createBooking',auth.verifyToken,bC.createBooking);
router.get('/getSelfBookings',auth.verifyToken,bC.getSelfBookings);
router.get('/getAllBookings',auth.verifyToken,auth.isTC,bC.getAllBookings);
router.get('/getBooking',auth.verifyToken,bC.getBooking);
router.post('/occupySeats',auth.verifyToken,bC.occupySeats);
router.post('/transferOwnership',auth.verifyToken,bC.transferOwnershp);
// router.post('/unOccupySeats',bC.unOccupySeats);

module.exports = router;