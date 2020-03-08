let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let data = require('./data.json');
const CONNECTION_URL = data.CloudDatabaseURL;

let app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { mongoose.connect(CONNECTION_URL, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },(err) =>
    {
        if(err)
        {
            console.log('Database Not Connected',err);
        }
        else
        {
            console.log('Database Connected Successfully and Back End Listening on Port',PORT);
        }
    });
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user',require('./routes/user.route'));
app.use('/train',require('./routes/train.route'));
app.use('/booking',require('./routes/booking.route'));
app.use('/notification',require('./routes/notification.route'));

app.get('/test',(req,res) =>
{
    res.status(200).send({ message: "Server Access Done" });
});

app.get('/',(req,res) =>
{
    res.status(200).send({ message: "Server Access Done" });
});