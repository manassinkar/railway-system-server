let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var user = new Schema({
    aadhaarNo: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: Number, required: true },
    password: { type: String, required: true },
    TC: { type: Boolean, required: true }
});

user.pre("save", function(next)
{
    console.log(this);
    this.password = bcrypt.hashSync(this.password,10);
    next();
});


var User = mongoose.model('user',user);
module.exports = User;