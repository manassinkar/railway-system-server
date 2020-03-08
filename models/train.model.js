let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seat = new Schema({
    number: { type: Number, required: true },
    occupied: { type: Boolean, required: true },
    occupiedByAadhaar: { type: Number, required: true }
},{ _id: false });

var coach = new Schema({
    name: { type: String, required: true },
    seats: { type: [seat], required: true }
},{ _id: false })

var train = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    durationMins: { type: Number, required: true },
    stations: [String],
    coaches:[coach],
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
});

var Train = mongoose.model('train',train);
module.exports = Train;