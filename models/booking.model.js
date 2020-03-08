let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seat = new Schema({
    seat: { type: Number, required: true },
    passenger: { type: Number, required: true },
    age: { type: Number, required: true }
},{ _id: false });

var booking = new Schema({
    aadhaarNo: { type: Number, required: true },
    PNR: { type: String, required: true, unique: true },
    trainNo: { type: Number, required: true },
    coachName: { type: String, required: true },
    seats: { type: [seat], required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    timestamp: { type: Date, required: true },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    status: { type: String, required: true }
});

var Booking = mongoose.model('booking',booking);
module.exports = Booking;