let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var occupied = new Schema({
    bookingID: { type: String, required: true },
    PNR: { type: String, required: true },
    trainNo: { type: Number, required: true },
    coachName: { type: String, required: true },
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

// "aadhaarNo":765974875989,
// "firstName":"Harsh",
// "lastName":"Shelar",
// "irctcID":"harsh12345",
// "email":"harshshelar22@gmail.com",
// "contactNo":9821856556,
// "password":"harsh12345"


// "aadhaarNo":888888888888,
// "firstName":"TC",
// "lastName":"TC",
// "irctcID":"tc12345",
// "email":"tc@gmail.com",
// "contactNo":9999999999,
// "password":"tc12345"


// "aadhaarNo":674611536346,
// "firstName":"Manas",
// "lastName":"Sinkar",
// "irctcID":"manas12345",
// "email":"manas.sinkar@gmail.com",
// "contactNo":9022942188,
// "password":"manas12345"


// "aadhaarNo":634340477195,
// "firstName":"Atul",
// "lastName":"Kamble",
// "irctcID":"atul12345",
// "email":"kambleatul26@gmail.com",
// "contactNo":8976490298,
// "password":"atul12345"


// "aadhaarNo":634574518213,
// "firstName":"Mridul",
// "lastName":"Pandey",
// "irctcID":"mridul12345",
// "email":"mridulpandey99@gmail.com",
// "contactNo":7715859073,
// "password":"mridul12345"