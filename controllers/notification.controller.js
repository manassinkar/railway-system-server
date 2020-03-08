let Notification = require('../models/notification.model');

exports.getNotifications = (req,res) =>
{
    Notification.find({ target: { $elemMatch:{ $eq: req.aadhaarNo } } },(err,notifications) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to fetch notifications", error: err });
        }
        else
        {
            var seats = [];
            notifications.forEach(notification =>
            {
                notification.seats.forEach(data => 
                {
                    if(data.passenger==req.aadhaarNo)
                    {
                        seats.push(data);
                    }
                });
            });
            res.status(200).send({notifications, seats});
        }
    });
};

exports.remove = (req,res) =>
{
    Notification.updateOne({ _id: req.body.notificationID },{ $pull: { target: req.aadhaarNo } },(err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Failed to remove notification", error:err });
        }
        else
        {
            res.status(200).send({ message: "Notification Removed" });
        }
    });
};