let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seat = new Schema({
    number: { type: Number, required: true },
    occupied: { type: Boolean, required: true }
},{ _id: false });

var coach = new Schema({
    name: { type: String, required: true },
    Seats: { type: [seat], required: true }
},{ _id: false })

var train = new Schema({
    name: { type: String, required: true },
    Number: { type: Number, required: true },
    Source: { type: String, required: true },
    Destination: { type: String, required: true },
    DurationMins: { type: Number, required: true },
    Stations: [String],
    coaches:[coach]
});

var Train = mongoose.model('train',train);
module.exports = Train;