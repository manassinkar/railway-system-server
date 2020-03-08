let jwt = require('jsonwebtoken');
let data = require('./data');

exports.verifyToken = (req, res, next) =>
{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        jwt.verify(bearer[1],data.jwtSecretKey, (err, d) =>
        {
            if(!err)
            {
                req.aadhaarNo = d.aadhaarNo,
                req.username = d.username,
                req.TC = d.TC
                next();
            }
            else
            {
                res.sendStatus(403);
            }
        });
    }
    else
    {
        res.sendStatus(403);
    }
}

exports.isTC = (req,res,next) =>
{
    if(req.TC)
    {
        next();
    }
    else
    {
        res.sendStatus(401);
    }
};