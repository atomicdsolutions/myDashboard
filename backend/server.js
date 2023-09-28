//require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();
var cron = require('node-cron');
const express = require("express");
const route = require('./routes/show.routes');
// const path = require('path');
const fs = require('fs')
const sleep = require('sleep-promise');
const {
    ObjectId
} = require('mongodb');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const cors = require("cors");
const app = express();

// const PORT = 3000;

// const serverOptions = {
// 	// Certificate(s) & Key(s)
// 	cert: fs.readFileSync(path.join('/etc/ssl/certs/nginx-selfsigned.crt')),
// 	key: fs.readFileSync(path.join('/etc/ssl/private/nginx-selfsigned.key')),

// 	// TLS Versions
// 	maxVersion: 'TLSv1.3',
// 	minVersion: 'TLSv1.2'
// }
// const server = require('https').Server(serverOptions, app);
const axios = require('axios');
var corsOPtions = {
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Access-Control-Allow-Private-Network': "true",
};

async function logging(msg) {
    console.log(new Date() + " " + msg);

    fs.appendFile('setools.log', new Date() + " " + msg + "\n", function (err) {
        if (err) throw err;
        // console.log('Saved!');
    });
}

app.use(cors(corsOPtions));
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my site" });
});

const db = require("./models");
const { publisher } = require('./models');
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

async function addDomainPublisher(name, Publisher) {
    logging("Addning Show " + name + " to AudioServe");
    var data = JSON.stringify({
        "email": Publisher.email,
        "name": name,
        "website": Publisher.website,
        "adswizzInstanceName": Publisher.instance,
        "types": [
            "Podcast"
        ]
    });


    var asoptions = {
        method: 'post',
        url: process.env.AW_DOMAIN_URL + '/v7/publishers',
        'headers': {
            'agency': Publisher.agency,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.adswizz-v7+json',
            'x-api-key': Publisher.apiKey
        },
        data: data
    };

    // let req = await axios.post( asoptions);

    axios(asoptions)
        .then(function (response) {
            // logging(JSON.stringify(response.data));
            logging("Creating Pre Roll");
            createZones(response.data.id, name, "Pre-Roll", "pre_roll", Publisher);
            logging("Creating Mid Roll");
            createZones(response.data.id, name, "Mid-Roll", "mid_roll", Publisher);
            logging("Creating Post Roll");
            createZones(response.data.id, name, "Post-Roll", "post_roll", Publisher);
        })
        .catch(function (error) {
            logging("Audioserve Error: " + error.message)
        });
    // logging(asoptions);


}



async function createZones(publisherid, name, POSITION, EXT, Publisher) {
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
        url: process.env.AW_DOMAIN_URL + '/v7/publishers/' + publisherid + '/zones',
        headers: {
            'agency': Publisher.agency,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.adswizz-v7+json',
            'x-api-key': Publisher.apiKey
        },
        data: data
    };

    await axios(config)
        .then(function () {

            // logging(JSON.stringify(response.data));
        })
        .catch(function (error) {
            logging("Audioserve Error: " + error);
        });
}


async function podscribe(showName, awCollectionId, rssFeed, Publisher) {
    logging("Podscribing " + showName);

    //Get Pub ID
    var purl = 'https://api.podscribe.adswizz.com/publishers?page=1&limit=100';
    var pconfig = {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'x-api-key': Publisher.podApiKey
        }
    };
    let preq = await axios.get(purl, pconfig);
    let pData = preq.data;

    var pubId = 0;
    for (let p of pData) {
        if (p.name == Publisher.name)
            pubId = p.id;
    }
    var npurl = 'https://api.podscribe.adswizz.com/publishers';
    var npconfig = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': Publisher.podApiKey
        },
        data: data
    };

    let npreq = await axios.get(npurl, npconfig);
    pubId = npreq.data.id;


    // logging("The Publisher ID is: " + pubId);
    var data = JSON.stringify({
        "awCollectionID": awCollectionId,
        "name": showName,
        "publisherId": pubId,
        "rssUrl": rssFeed
    });

    var config = {
        method: 'post',
        url: 'https://api.podscribe.adswizz.com/shows',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': Publisher.podApiKey
        },
        data: data
    };

    // logging(config);
    axios(config)
        .then(function () {
            // logging(JSON.stringify(response.status));
        })
        .catch(function (error) {
            logging("Podscribe Error: " + error);
        });

}
async function SendNotifcation(Show, Publisher) {
    // logging("Show Data " + Show);
    // logging("Publisher Data " + Publisher);
    // 'accounts@simplecast.com', 'solutions@adswizz.com' , 'travis.klein@adswizz.com', 'jeff.soll@adswizz.com'
    const msg = {
        to: ['accounts@simplecast.com', 'solutions@adswizz.com'], // Change to your recipient
        from: { email: 'support@simplecast.com', name: 'No-Reply-Simplecast' },
        replyTo: { email: 'support@simplecast.com', name: 'No-Reply-Simplecast' }, // Change to your verified sender
        subject: 'TAM Notification:: ' + Publisher.name + " :: " + Show.name + ':: New Show Found',
        // text: 'A new show has been found named: ' + Show + ' We have already Added it to AudioServe with a pre, mid, post roll. We have also, Podscribe the show. Lastly we have added it to our database for monitoring.',
        html: '<p>New show name has been found: ' + Show.name + '<br> \
        Account: '+ Publisher.name + '– ' + Publisher.user + ' <br> \
        Instance: ' + Publisher.instance + ' <br> \
        Show: '+ Show.name + ' – ' + Show.awCollectionId + '</p> \
        \
        <ul class="list-group"> \
            <li class="list-group-item active">Show has been added to AudioServe</li> \
            <li class="list-group-item active">Default zones are pre, mid, post roll</li> \
            <li class="list-group-item active">Podscribe complete</li> \
            <li class="list-group-item active">Active for monitoring</li> \
        </ul>\
        \
    <strong>Warning:</strong> Show will not monetize until an L2 ticket has been completed'
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error("Send Email Error" + error)
        })
}


async function checkChange(Publisher) {
    //Getting SimpleCast Shows For Publisher
    logging("Getting Shows for: " + Publisher.name);
    // let url = process.env.API_URL + '/users/' + Publisher.user + '/podcasts?limit=100';
    let offset = 0;
    let nextpage = false;
    let showct = 1;
    var options = {
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.API_KEY
        },
        'maxRedirects': 20
    };
    try {
        let url = process.env.API_URL + '/users/' + Publisher.user + '/podcasts?limit=100' + '&offset=' + offset;
        // logging("Url: " + url);
        let req = await axios.get(url, options);
        if (req.data.pages.next !== null) {
            nextpage = true;
        }
        let sData = req.data.collection;
        // logging(nextpage);
        while (nextpage) {
            offset += 100
            let url = process.env.API_URL + '/users/' + Publisher.user + '/podcasts?limit=100' + '&offset=' + offset;
            let nreq = await axios.get(url, options);
            sData = sData.concat(nreq.data.collection);
            if (nreq.data.pages.next !== null) {
                nextpage = true;
            }
            else {
                nextpage = false;
            }
        }

        // Get Database Shows for Publisher
        logging("Getting Local Shows");
        const Show = db.shows;
        let localShows = await Show.find({ "publisherId": Publisher.id })
            .then(data => {
                return data;
            })
            .catch(err => {
                logging(err.message || "Some error occurred while retrieving shows.");
            });
        // logging(JSON.stringify(sData));
        logging("Comparing Local Shows with SC")
        for (let s of sData) {
            logging("***************" + Publisher.name + " Show " + showct + " of " + sData.length + " ***************")

            var found = localShows.find(function (show) {
                if (show.awCollectionId == s.id) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (!found) {
                logging("SC " + s.title + " Show Does not Exist");

                //Get RSS Feed
                var furl = "https://api.simplecast.com/podcasts/" + s.id + "?is_pending_invitation=false";
                var fconfig = {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + process.env.API_KEY
                    }
                };
                let freq = await axios.get(furl, fconfig);
                var feed = freq.data.feed_url;

                await sleep(2000);
                logging("Ading new Publisher with zones: " + s.title);
                addDomainPublisher(s.title, Publisher);
                logging("Podscribing: " + s.title);
                podscribe(s.title, s.id, feed, Publisher);


                var exist = await Show.find({ "awCollectionId": s.id })
                    .then(data => {
                        var stringified = JSON.stringify(data);
                        var parsedObj = JSON.parse(stringified);
                        return (s.id === parsedObj[0].awCollectionId);
                    })
                    .catch(err => {
                        logging(err.message || "Some error occurred while retrieving shows.");
                        return false;
                    });
                var sNewShow = new Show();
                if (exist) { logging("This is a Duplicate Show"); }
                else {
                    // Create a show
                    const show = new Show({
                        name: s.title,
                        showCount: s.episodes.count,
                        awCollectionId: s.id,
                        published: s.status,
                        publisherId: Publisher.id,
                        rssFeed: feed,
                        image_url: s.image_url

                    });
                    try {
                        sNewShow = show;
                        show.save(show);
                    }
                    catch (error) {
                        logging(error);
                    }
                }
                // logging(show);
                logging("Sending Email");
                SendNotifcation(sNewShow, Publisher);
            }
            else {
                logging("SC: " + s.title + " Show Exist");
            }

            showct++;
        }

    } catch (error) {
        logging("Error: " + error.message);
    }
}
//'* 7,15 * * *'
// cron.schedule('0 22,13 * * *', async function () {
//     let localPublishers = await publisher.find({})
//         .then(pdata => {
//             return pdata;
//         });

//     // logging(localPublishers);
//     for (let p of localPublishers) {
//         // console.log(p.id);
//         if (p.imported == true) {
//             checkChange(p);
//         } else {
//             logging(p.name + " Has not been imported yet")
//         }
//     }
// }, {
//     scheduled: true,
//     timezone: "America/Sao_Paulo"
// });

require("./routes/show.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logging(`Server is running on port ${PORT}`);
});

// // Start the Server
// server.listen(PORT, () => {
//     console.log(`[-] Server Listening on Port ${PORT}`);
// });
