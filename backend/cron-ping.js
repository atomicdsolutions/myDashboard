require('dotenv').config();
const db = require("../models");



var express = require('express')
    , path = require('path')
    , app = express()
    , cors = require('cors')
    , axios = require('axios');



app.use(cors());
const PORT = process.env.PORT || 3010;
app.set('port', process.env.PORT || 3010);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, function () {
    console.log('Node.js server is running on port ' + PORT);
});

function getShows() {
    axios.get(process.env.API_URL + "/users/" + "39986929-af67-42ac-9c64-72152f3364e4" + "/podcasts", {
        headers: {
            'authorization': 'bearer ' + process.env.API_KEY,
        }
    })
        .then(response => {
            const shows = response.data.collection
            shows.forEach(element => {
                console.log("Title: " + element.title);
            });

        }).catch(error => {
            console.log(error);
        });
}

function getLocalShows(pubId) {
    const Show = db.shows;
    Show.find({ publisherId: pubId })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving shows."
            });
        });
}

function checkChanges() {
    const scShows = getShows();
    const lShows = getLocalShows("62bf2866c14cf8f854db04e4");
    return scShows
}

var cron = require('node-cron');
cron.schedule('* * * * *', () => {

    console.log(checkChanges());
})