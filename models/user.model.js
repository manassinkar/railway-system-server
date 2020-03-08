let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var occupied = new Schema({
    bookingID: { type: String, required: true },
    PNR: { type: String, required: true },
    trainNo: { type: Number, required: true },
    coachName: { type: Number, required: true },
    seatNo: { type: Number, required: true },
    age: { type: Number, required: true }
},{_id: false});

var user = new Schema({
    aadhaarNo: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    irctcID: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: Number, required: true },
    password: { type: String, required: true },
    TC: { type: Boolean, required: true },
    occupied: { type: occupied }
});

user.pre("save", function(next)
{
    this.password = bcrypt.hashSync(this.password,10);
    this.firstName = this.firstName.charAt(0).toUpperCase()+this.firstName.slice(1).toLowerCase();
    this.lastName = this.lastName.charAt(0).toUpperCase()+this.lastName.slice(1).toLowerCase();
    next();
});


var User = mongoose.model('user',user);
module.exports = User;