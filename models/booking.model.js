let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var booking = new Schema({
    aadhaarNo: { type: Number, required: true },
    PNR: { type: Number, required: true, unique: true },
    trainNo: { type: Number, required: true },
    coachName: { type: String, required: true },
    seats: { type: [Number], required: true },
    timestamp: { type: Date, required: true },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true }
});

var Booking = mongoose.model('booking',booking);
module.exports = Booking;
