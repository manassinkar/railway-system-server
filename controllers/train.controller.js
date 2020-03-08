let Train = require('../models/train.model');
let Booking = require('../models/booking.model');
let User = require('../models/user.model');

exports.createTrain = (req,res) =>
{
    var train = new Train({
        name: req.body.name,
        number: req.body.number,
        source: req.body.source,
        destination: req.body.destination,
        durationMins: req.body.durationMins,
        stations: req.body.stations,
        latitude: 0,
        longitude: 0
    });
    var coaches = [];
    var char = req.body.coachChar;
    var seats = [];
    for(var j=1;j<=req.body.numSeats;j++)
    {
        var seat = {
            number: j,
            occupied: false,
            occupiedByAadhaar: 0
        }
        seats.push(seat);
    }
    for(var i=1;i<=req.body.numCoaches;i++)
    {
        var coach = {
            name: char + i.toString(),
            seats: seats
        }
        coaches.push(coach);
    }
    train.coaches = coaches;
    train.save((err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Train Creation Failed", error: err });
        }
        else
        {
            res.status(200).send({ message: "Train Creation Successfully", train });
        }
    });
};

exports.getAllTrains = (req,res) =>
{
    Train.find({},{ coaches: 0 },(err,ans) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch Train Information", error: err });
        }
        else
        {
            res.status(200).send(ans);
        }
    });
};

exports.getTrain = (req,res) =>
{
    Train.findOne({ _id: req.query.trainID },(err,ans) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch Train Information", error: err });
        }
        else
        {
            res.status(200).send(ans);
        }
    });
};

function unOccupy(booking,train)
{
    var seats = booking.seats
    var coach = booking.coachName;
    var coachIndex = parseInt(coach.slice(1))-1;
    seats.forEach((seat) =>
    {
        train.coaches[coachIndex].seats[data.seat-1].occupied = false;
        train.coaches[coachIndex].seats[data.seat-1].occupiedBy = 0;
    });
    return train
}

function updateUsers(train,booking)
{
    var passengers = booking.seats.map(elem=> elem.passenger);
    User.update({ aadhaarNo: { $in: passengers } },{ $unset: { occupied: "" } },(err,ans) =>
    {
        return true;
    });
}

exports.updateTrainLocation = (req,res) =>
{
    Train.findOneAndUpdate({ _id: req.body.trainID },{ latitude: req.body.latitude, longitude: req.body.longitude },{ new: true },(err,train) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to Update Train Location", error: err });
        }
        else
        {
            if(req.body.location)
            {
                Booking.find({ trainNo: train.number, destination: req.body.location, status: "CNF" },(er,bookings) =>
                {
                    if(er)
                    {
                        res.status(500).send({ message: "Failed to fetch booking Information", error: er });
                    }
                    else
                    {
                        bookings.forEach((booking) =>
                        {
                            train = unOccupy(booking,train);
                            var x = updateUsers(train,booking);
                        });
                        train.save((e) =>
                        {
                            if(e)
                            {
                                res.status(500).send({ message: "Failed to Update & Save Train Status",error: e });
                            }
                            else
                            {
                                res.status(200).send({ message: "Seats Unoccupied Successfully" });
                            }
                        });
                    }
                });
            }
            else
            {
                res.status(200).send({ message: "Train Location Updated Successfully" });
            }
        }
    })
};