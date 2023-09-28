const db = require("../models");
const Show = db.shows;


exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a show
  const show = new Show({
    name: req.body.name,
    showCount: req.body.showCount,
    awCollectionId: req.body.awCollectionId,
    published: req.body.published ? req.body.published : false,
    publisherId: req.body.publisherId,
    rssFeed: req.body.rssFeed,
    image_url: req.body.image_url
  });
  // Save show in the database
  show
    .save(show)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the show."
      });
    });
};

exports.findAll = (req, res) => {
  console.log(req.query);
  const name = req.query.name;
  const publisherId = req.query.publisherId;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  Show.find(req.query)
    .then(data => {
      // console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shows."
      });
    });
};

exports.findAllByPubId = (req, res) => {
  const publisherId = req.query.publisherId;
  // console.log(req);
  Show.find({ publisherId: publisherId })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shows."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Show.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found show with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving show with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  Show.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update show with id=${id}. Maybe show was not found!`
        });
      } else res.send({ message: "show was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating show with id=" + id
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  Show.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete show with id=${id}. Maybe show was not found!`
        });
      } else {
        res.send({
          message: "show was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete show with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Show.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} shows were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all shows."
      });
    });
};


exports.findAllPublished = (req, res) => {
  Show.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shows."
      });
    });
};

exports.getPublishedCount = (req, res) => {
  Show.find({})
    .then(data => {
      const byName = groupBy(data.filter(it => it.Selcted), it => it['Version Name'])

      const output = Object.keys(byName).map(name => {
        const byZone = groupBy(byName[name], it => it.Zone)
        // const sum = byName[name].reduce((acc, it) => acc + it.Value, 0)
        return {
          'Version Name': name,
          ZoneCount: Object.keys(byZone).length
          // ValueSum: sum
        }
      })
      res.send(output);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shows."
      });
    });
};