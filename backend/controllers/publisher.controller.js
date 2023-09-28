const logger = require("../middleware/logger");
const db = require("../models");
const Publisher = db.publisher;
logger

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
      logger.error('Content can not be empty!');
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    // Create a publisher
    const publisher = new Publisher({
      name: req.body.name,
      email: req.body.email,
      website: req.body.website,
      instance: req.body.instance,
      type: req.body.type,
      agency: req.body.agency,
      showCount: req.body.showCount,
      published: req.body.published ? req.body.published : false,
      apiKey: req.body.apiKey,
      podApiKey: req.body.podApiKey,
      user: req.body.user,
      awsApikey: req.body.awsApikey,
      awsApiUsagePlan: req.body.awsApiUsagePlan,
      imported: req.body.imported
    });
    // Save publisher in the database
    publisher
      .save(publisher)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        logger.error(err.message || "Some error occurred while creating the publisher.");
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the publisher."
        });
      });
  };

  exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Publisher.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        logger.error(err.message || "Some error occurred while retrieving publishers.");
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving publishers."
        });
      });
  };
  

  exports.findOne = (req, res) => {
    const id = req.params.id;
    Publisher.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found publisher with id " + id });
        else res.send(data);
      })
      .catch(err => {
        logger.error(err.message || "Error retrieving publisher with id=" + id);
        res
          .status(500)
          .send({ message: "Error retrieving publisher with id=" + id });
      });
  };

  exports.update = (req, res) => {
    if (!req.body) {
      logger.error('Data to update can not be empty!');
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    const id = req.params.id;
    Publisher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        // console.log(data);
        if (!data) {
         logger.error(`Cannot update publisher with id=${id}. Maybe publisher was not found!`);
          res.status(404).send({
            message: `Cannot update publisher with id=${id}. Maybe publisher was not found!`
          });
        } else res.send({ message: "publisher was updated successfully." });
      })
      .catch(err => {
        logger.error(err.message || "Error updating publisher with id=" + id);
        res.status(500).send({
          message: "Error updating publisher with id=" + id
        });
      });
  };
  

  exports.delete = (req, res) => {
    const id = req.params.id;
    Publisher.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete publisher with id=${id}. Maybe publisher was not found!`
          });
        } else {
          res.send({
            message: "publisher was deleted successfully!"
          });
        }
      })
      .catch(err => {
        logger.error(err.message || "Could not delete publisher with id=" + id);
        res.status(500).send({
          message: "Could not delete publisher with id=" + id
        });
      });
  };

  exports.deleteAll = (req, res) => {
    Publisher.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} publishers were deleted successfully!`
        });
      })
      .catch(err => {
        logger.error(err.message || "Some error occurred while removing all publishers.");
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all publishers."
        });
      });
  };
  

  exports.findAllPublished = (req, res) => {
    Publisher.find({ published: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        logger.error(err.message || "Some error occurred while retrieving publishers.");
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving publishers."
        });
      });
  };