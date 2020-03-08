let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seat = new Schema({
    seat: { type: Number, required: true },
    passenger: { type: Number, required: true },
    age: { type: Number, required: true }
},{ _id: false });

var notification = new Schema({
    PNR: { type: String, required: true },
    trainNo: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    bookingID: { type: String, required: true },
    message: { type: String, required: true },
    target: { type: [Number], required: true },
    seats: { type: [seat], required: true }
});

var Notification = mongoose.model('notification',notification);
module.exports = Notification;