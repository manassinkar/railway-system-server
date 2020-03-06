let User = require('../models/user.model');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let data = require('../data');

exports.login = (req,res) =>
{
    User.findOne({ username: req.body.username },(err,user) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to Fetch User Information", error: err });
        }
        else
        {
            if(user)
            {
                bcrypt.compare(req.body.password,user.password,(er,success) =>
                {
                    if(er)
                    {
                        res.status(500).send({ message: "Error while checking password", error: er });
                    }
                    else
                    {
                        if(success)
                        {
                            var obj = {
                                aadhaarNo: user.aadhaarNo,
                                username: user.username,
                                TC: user.TC
                            }
                            jwt.sign(obj,data.jwtSecretKey,(e,token) =>
                            {
                                if(e)
                                {
                                    res.status(500).send({ message: 'Authentication Failed', metaMessage: 'Token Generation Failed', error: e });
                                }
                                else
                                {
                                    res.status(200).send({ message: 'Login Successful', token: token, TC: user.TC });
                                }
                            });
                        }
                        else
                        {
                            res.status(401).send({ message: "Wrong Password" });
                        }
                    }
                });
            }
            else
            {
                res.status(404).send({ message: "User Not Found, Please Register" });
            }
        }
    });
};

exports.register = (req,res) =>
{
    var user = new User(req.body.user);
    user.save((err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Registeration Failed", error: err });
        }
        else
        {
            res.status(200).send({ message: "User Registered Successfully" });
        }
    });
};