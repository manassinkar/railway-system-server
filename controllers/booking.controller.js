let Booking = require('../models/booking.model');
let Train = require('../models/train.model');
let User = require('../models/user.model');
var Notification = require('../models/notification.model');

function generatePNR() {
    var result = '';
    var numbers = '0123456789'
    var numlength = numbers.length;
    for (var i=0;i<10;i++)
    {
        result += numbers.charAt(Math.floor(Math.random() * numlength));
    }
    return result;
 }

exports.createBooking = (req,res) =>
{
    var start = new Date();
    var test = new Date();
    var end = new Date(test.setMonth(test.getMonth()+6));
    var booking = new Booking({
        aadhaarNo: req.aadhaarNo,
        PNR: generatePNR(),
        trainNo: req.body.trainNo,
        coachName: req.body.coachName,
        seats: req.body.seats,
        passengers: req.body.passengers,
        source: req.body.source,
        destination: req.body.destination,
        status: req.body.status,
        timestamp: start,
        validFrom: start,
        validTill: end
    });
    booking.save((err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Booking Failed", error: err });
        }
        else
        {
            res.status(200).send({ message: "Booking Created Successfully" });
        }
    });
};

exports.getSelfBookings = (req,res) =>
{
    Booking.find({ $or: [{ aadhaarNo: req.aadhaarNo },{ "seats.passenger": req.aadhaarNo }] },{ _id: 1, PNR: 1, trainNo: 1 },(err,ans)=>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch Booking Information", error: err });
        }
        else
        {
            res.status(200).send(ans);
        }
    });
};

exports.getBooking = (req,res) =>
{
    Booking.findOne({ _id: req.query.bookingID },(err,booking)=>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch Booking Information", error: err });
        }
        else
        {
            Train.findOne({ number: booking.trainNo },{ coaches: 1 },(er,train) =>
            {
                if(er)
                {
                    res.status(500).send({ message: "Failed to fetch Train Information", error: err });
                }
                else
                {
                    var occupiedList = [];
                    var coach = booking.coachName;
                    var coachIndex = parseInt(coach.slice(1))-1;
                    booking.seats.forEach((data) =>
                    {
                        occupiedList.push(train.coaches[coachIndex].seats[data.seat-1].occupied);
                    });
                    res.status(200).send({booking, occupiedList});
                }
            });
        }
    });
};

exports.getAllBookings = (req,res) =>
{
    Booking.find({},{ _id: 1, PNR: 1, trainNo: 1 },(err,ans)=>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch Booking Information", error: err });
        }
        else
        {
            res.status(200).send(ans);
        }
    });
};

async function unOccupyPreviousIfAny(aadhaarNo)
{
    await User.findOne({ aadhaarNo: aadhaarNo }, async (err,user) =>
    {
        if(err)
        {
            return false;
        }
        else
        {
            if(user.occupied)
            {
                await Booking.findOne({ _id: user.occupied.bookingID },async (er,booking)=>
                {
                    if(er)
                    {
                        return false;
                    }
                    else
                    {
                        await Train.findOne({ number: booking.trainNo },async (e,train) =>
                        {
                            if(e)
                            {
                                return false;
                            }
                            else
                            {
                                var seats = req.body.seats;
                                var coach = booking.coachName;
                                var coachIndex = parseInt(coach.slice(1))-1;
                                seats.forEach((data) =>
                                {
                                    train.coaches[coachIndex].seats[data.seat-1].occupied = false;
                                    train.coaches[coachIndex].seats[data.seat-1].occupiedBy = 0;
                                });
                                await train.save(async (erro) =>
                                {
                                    if(erro)
                                    {
                                        return false;
                                    }
                                    else
                                    {
                                        return true;
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else
            {
                return true;
            }
        }
    })
};

async function occupyNewSeats(booking,seats,train)
{
    var coach = booking.coachName;
    var coachIndex = parseInt(coach.slice(1))-1;
    seats.forEach((data) =>
    {
        train.coaches[coachIndex].seats[data.seat-1].occupied = true;
        train.coaches[coachIndex].seats[data.seat-1].occupiedByAadhaar = data.passenger;
        var y = updateUser(booking,data);
        var x = removePastNotificationData(data.passenger);
    });
    var array = booking.seats.map(element =>element.passenger);
    array.splice(array.indexOf(booking.aadhaarNo),1);
    var notification = new Notification({
        PNR: booking.PNR,
        trainNo: booking.trainNo,
        timestamp: booking.timestamp,
        bookingID: booking._id,
        seats: booking.seats,
        message: "Join the journey",
        target: array
    });
    await notification.save(async (er) =>
    {
        if(er)
        {
            return false;
        }
        else
        {
            await train.save(async (e) =>
            {
                if(e)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            });
        }
    });
}

async function removePastNotificationData(aadhaarNo)
{
    await Notification.updateMany({ target: { $elemMatch:{ $eq: aadhaarNo } } },{ $pull: { target: aadhaarNo } },async (error) =>
    {
        if(error)
        {
            return false;
        }
        else
        {
            return true
        }
    });
};

async function updateUser(booking,data)
{
    var occupiedObj = {
        bookingID: booking._id,
        PNR: booking.PNR,
        trainNo: booking.trainNo,
        coachName: booking.coachName,
        seatNo: data.seat,
        age: data.age
    };
    console.log(data.passenger);
    await User.findOneAndUpdate({ aadhaarNo : data.passenger },{ occupied: occupiedObj },async (err,user) =>
    {
        if(err)
        {
            console.log(err);
            return false;
        }
        else
        {
            console.log(user);
            return true;
        }
    });
};

async function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
async function deg2rad(deg) {
    return deg * (Math.PI/180)
}

async function matchLocation(location,bookingID)
{
    await Booking.findOne({ _id: bookingID },{ trainNo: 1 },async (err,booking) =>
    {
        if(err)
        {
            return false;
        }
        else
        {
            await Train.findOne({ number: booking.trainNo },{ latitude: 1, longitude: 1 },async (er,train) =>
            {
                if(er)
                {
                    return false;
                }
                else
                {
                    var distance = getDistanceFromLatLonInKm(train.latitude,train.longitude,location.latitude,location.longitude);
                    if(distance<=2)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            });
        }
    });
};

exports.occupySeats = (req,res) =>
{
    var matchLoc = matchLocation(req.body.location,req.body.bookingID);
    if(!matchLoc)
    {
        res.status(401).send({ message: "You are not near the train to perform occupy seats" });
    }
    else
    {
        var success = unOccupyPreviousIfAny(req.aadhaarNo);
        if(!success)
        {
            res.status(500).send({ message: "Unoccupying previous seats failed" });
        }
        else
        {
            Booking.findOne({ _id: req.body.bookingID },(err,booking)=>
            {
                if(err)
                {
                    res.status(500).send({ message: "Failed to fetch Booking Information", error: err });
                }
                else
                {
                    Train.findOne({ number: booking.trainNo },(er,train) =>
                    {
                        if(er)
                        {
                            res.status(500).send({ message: "Failed to Updated Train Status",error: er });
                        }
                        else
                        {
                            var final = occupyNewSeats(booking,req.body.seats,train);
                            if(!final)
                            {
                                res.status(500).send({ message: "Failed to occupy seats" });
                            }
                            else
                            {
                                res.status(200).send({ message: "Occupied Seats Successfully" });
                            }
                        }
                    });
                }
            });
        }
    }
};

exports.transferOwnershp = (req,res) =>
{
    Booking.updateOne({ _id: req.body.bookingID },{ aadhaarNo: req.body.aadhaarNo },(err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to update Booking Information", error: err });
        }
        else
        {
            res.status(200).send({ message: "Ownership Transfered Successfully" });
        }
    });
};

// exports.getWLBookings = (req,res) =>
// {
//     Booking.find({ status: "WL" },(err,bookings) =>
//     {

//     });
// };

// exports.unOccupySeats = (req,res) =>
// {
    // Booking.findOne({ _id: req.body.bookingID },(err,booking)=>
    // {
    //     if(err)
    //     {
    //         res.status(500).send({ message: "Failed to fetch Booking Information", error: err });
    //     }
    //     else
    //     {
    //         Train.findOne({ number: booking.trainNo },(er,train) =>
    //         {
    //             if(er)
    //             {
    //                 res.status(500).send({ message: "Failed to Updated Train Status",error: er });
    //             }
    //             else
    //             {
    //                 var seats = req.body.seats;
    //                 var coach = booking.coachName;
    //                 var coachIndex = parseInt(coach.slice(1))-1;
    //                 seats.forEach((data) =>
    //                 {
    //                     train.coaches[coachIndex].seats[data.seat-1].occupied = false;
    //                     train.coaches[coachIndex].seats[data.seat-1].occupiedBy = 0;
    //                 });
    //                 train.save((e) =>
    //                 {
    //                     if(e)
    //                     {
    //                         res.status(500).send({ message: "Failed to Update & Save Train Status",error: e });
    //                     }
    //                     else
    //                     {
    //                         res.status(200).send({ message: "Seats Unoccupied Successfully" });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
// };