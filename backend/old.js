require('dotenv').config();
var cron = require('node-cron');
const express = require("express");
const {
    ObjectId
} = require('mongodb');
const sgMail = require('@sendgrid/mail');
var nodemailer = require('nodemailer');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const cors = require("cors");
const app = express();

const axios = require('axios');

var corsOPtions = { 'Access-Control-Allow-Origin': 'http://localhost:8000',
                  'Access-Control-Allow-Private-Network': "true",
                  };

async function logging(msg) {
    console.log(msg);
}

app.use(cors(corsOPtions));
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my site" });
});

const db = require("./models");
const Show = db.shows;
const Publisher = db.publisher;
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        logging("Connected to the database!");
    })
    .catch(err => {
        logging("Cannot connect to the Database!", err);
        process.exit();
    });

async function addPublisher(name) {
    logging("Addning Show " + name + " to AudioServe");
    var data = JSON.stringify({
        "email": "peuge.benjamin@adswizz.com",
        "name": name,
        "website": "https://www.audiopub.com",
        "adswizzInstanceName": "demo",
        "types": [
            "Podcast"
        ]
    });
    let url = 'https://api.adswizz.com/domain//v7/publishers';
    var asoptions = {
        method: 'post',
        url: 'https://api.adswizz.com/domain//v7/publishers',
        'headers': {
            'agency': '654',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.adswizz-v7+json',
            'x-api-key': 'nNokOEHcsRUoh6bUkrB7wFRBwycaL9GfQ62RyNr3'
        },
        data: data
    };

    // let req = await axios.post( asoptions);

    axios(asoptions)
        .then(function (response) {
            // logging(JSON.stringify(response.data));
            logging("Creating Pre Roll");
            createZones(response.data.id, name, "Pre-Roll", "pre_roll");
            logging("Creating Mid Roll");
            createZones(response.data.id, name, "Mid-Roll", "mid_roll");
            logging("Creating Post Roll");
            createZones(response.data.id, name, "Post-Roll", "post_roll");
        })
        .catch(function (error) {
            logging(error)
        });
    // logging(req);


}
async function addPsPublisher(name) {
    logging("Getting Podscribe Publishers");
    var data = JSON.stringify({
        "name": name,
        "website": "https://" + name + ".com"
    });

    var config = {
        method: 'post',
        url: 'https://api.podscribe.adswizz.com/publishers',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': '4ccab4e0-905e-11ea-a099-35c9a12e91b2'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            // logging(JSON.stringify(response.data));
            let id = response.data.id;
            // logging(id);
        })
        .catch(function (error) {
            logging(error);
        });
}

async function getPublisher() {
    logging("Getting AudioServe Publisher");
    var config = {
        method: 'get',
        url: 'https://api.podscribe.adswizz.com/publishers?page=1&limit=100',
        headers: {
            'Accept': 'application/json',
            'x-api-key': '4ccab4e0-905e-11ea-a099-35c9a12e91b2'
        }
    };
    let req = await axios.get(config);
    loggin(req.data);
    // axios(config)
    //     .then(async function (response) {
    //         return await response.data;
    //     })
    //     .catch(function (error) {
    //         logging(error);
    //     });
}


async function createZones(publisherid, name, POSITION, EXT) {
    logging("Creating: " + name + " " + POSITION + " Zone")
    var data = JSON.stringify({
        "name": name + " - " + POSITION,
        "type": "AUDIO",
        "description": "Zone description",
        "formatId": POSITION,
        "externalRef": name.split(" ").join("_") + "_" + EXT
    });

    var config = {
        method: 'post',
        url: 'https://api.adswizz.com/domain/v7/publishers/' + publisherid + '/zones',
        headers: {
            'agency': '654',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.adswizz-v7+json',
            'x-api-key': 'nNokOEHcsRUoh6bUkrB7wFRBwycaL9GfQ62RyNr3'
        },
        data: data
    };

    await axios(config)
        .then(function (response) {

            // logging(JSON.stringify(response.data));
        })
        .catch(function (error) {
            logging(error);
        });
}


async function podscribe(name, awCollectionId, publisher) {
    logging("Podscribing " + name);

    //Get RSS Feed
    var furl = "https://api.simplecast.com/podcasts/" + awCollectionId + "?is_pending_invitation=false";
    var fconfig = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhcGlfa2V5IjoiN0xaSTRJRFA3MEhVcW5RUWgzU0o5SE9yYkhIVTlyN2hwZlFhMlFPTktxVT0ifQ=='
        }
    };
    let freq = await axios.get(furl, fconfig);
    var feed = freq.data.feed_url;

    //Get Pub ID
    var purl = 'https://api.podscribe.adswizz.com/publishers?page=1&limit=100';
    var pconfig = {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'x-api-key': '26f813e0-481a-48cf-942d-04ddef02d311'
        }
    };
    let preq = await axios.get(purl, pconfig);
    let pData = preq.data;

    var pubId = 0;
    for (let p of pData) {
        if (p.name == publisher)
            pubId = p.id;
    }


    // logging("The Publisher ID is: " + pubId);
    var data = JSON.stringify({
        "awCollectionID": awCollectionId,
        "name": name,
        "publisherId": pubId,
        "rssUrl": feed
    });

    var config = {
        method: 'post',
        url: 'https://api.podscribe.adswizz.com/shows',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': '26f813e0-481a-48cf-942d-04ddef02d311'
        },
        data: data
    };

    // logging(config);
    axios(config)
        .then(function (response) {
            // logging(JSON.stringify(response.status));
        })
        .catch(function (error) {
            logging(error);
        });

}
async function SendNotifcation(Show, pubId) {
    var mongoose = require('mongoose')


    let pub = await Publisher.find({ "_id": mongoose.Types.ObjectId(pubId) })
        .then(data => {
            return data;
        })
        .catch(err => {
            logging(err.message || "Some error occurred while retrieving shows.");

        });

    // console.log(pub[0].name);
    // 'accounts@simplecast.com', 'solutions@adswizz.com'
    const msg = {
        to: ['accounts@simplecast.com'], // Change to your recipient
        from: { email: 'support@simplecast.com', name: 'Simplecast' },
        replyTo: { email: 'support@simplecast.com', name: 'Simplecast' }, // Change to your verified sender
        subject: 'TAM Notification:: ' + pub[0].name + ':: New Show Found',
        // text: 'A new show has been found named: ' + Show + ' We have already Added it to AudioServe with a pre, mid, post roll. We have also, Podscribe the show. Lastly we have added it to our database for monitoring.',
        html: 'New show name has been found: ' + pub[0].name + ' <ul class="list-group"><li class="list-group-item active">Show has been added to AudioServe</li><li class="list-group-item active">Default zones are pre, mid, post roll</li><li class="list-group-item active">Podscribe complete</li><li class="list-group-item active">Active for monitoring</li></ul><strong>Warning:</strong> Show will not monetize until an L2 ticket has been completed'
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

cron.schedule('0 8 * * *', async function () {
    let url = 'https://api.simplecast.com/users/9cba4194-6d3a-42bb-Ab05-8e998c4c4f93/podcasts';
    var options = {
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhcGlfa2V5IjoiN0xaSTRJRFA3MEhVcW5RUWgzU0o5SE9yYkhIVTlyN2hwZlFhMlFPTktxVT0ifQ=='
        },
        'maxRedirects': 20
    };
    let req = await axios.get(url, options);
    // logging(req.data.collection);
    const Show = db.shows;
    let localShows = await Show.find({ "publisherId": "62e1c40dc9e59101717203c2" })
        .then(data => {
            return data;
        })
        .catch(err => {
            logging(err.message || "Some error occurred while retrieving shows.");

        });
    // logging(localShows);


    let sData = req.data.collection


    for (let s of sData) {
        var found = localShows.find(function (show, index) {
            if (show.awCollectionId == s.id)
                return true;
        });

        if (found) {
            logging("SC: " + s.title + " : " + s.id + " Show Exist");
        }
        else {
            logging("SC " + s.title + " : " + s.id + " Show Does not Exist");
            // delay(20);
            //logging("Ading new Publisher with zones: " + s.title);
            // addPublisher(s.title);
            // // delay(20);
           // logging("Podscribing: " + s.title + " : " + s.id);
            // podscribe(s.title, s.id, "Univision");
            // Create a show
             const show = new Show({
                 name: s.title,
                 showCount: s.episodes.count,
                 awCollectionId: s.id,
                 published: s.status,
                 publisherId: '62e1c40dc9e59101717203c2'
             });
            // Save show in the database
             show.save(show);
            logging("Sending Email");
            SendNotifcation(s.title, '62e1c40dc9e59101717203c2');
        }
    }

}, {
   scheduled: true,
   timezone: "America/Los_Angeles"
 });

require("./routes/show.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logging(`Server is running on port ${PORT}`);
});



