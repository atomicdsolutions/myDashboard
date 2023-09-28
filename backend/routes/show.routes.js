module.exports = app => {
  const shows = require("../controllers/show.controller.js");
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/show", shows.create);
  // Retrieve all shows
  router.get("/shows", shows.findAll);
  // Retrieve all published shows
  router.get("/show/published", shows.findAllPublished);
  // Retrieve all published shows
  router.get("/show/publisher/:id", shows.findAllByPubId);
  // Retrieve a single Tutorial with id
  router.get("/show/:id", shows.findOne);
  // Retrieve a single Tutorial with id
  router.get("/show/:id", shows.findOne);
  // Update a Tutorial with id
  router.put("/publishedCount", shows.getPublishedCount);
  // Delete a Tutorial with id
  router.delete("/show/:id", shows.delete);
  // Create a new Tutorial
  router.delete("/show/", shows.deleteAll);

  const publisher = require("../controllers/publisher.controller.js");
  router.post("/publisher", publisher.create);
  // Retrieve all shows
  router.get("/publishers", publisher.findAll);
  // Retrieve a single Tutorial with id
  router.get("/publisher/:id", publisher.findOne);
  // Update a Tutorial with id
  router.put("/publisher/:id", publisher.update);
  // Delete a Tutorial with id
  router.delete("/publisher/:id", publisher.delete);
  // Create a new Tutorial
  router.delete("/publisher/", publisher.deleteAll);


  //AWS API GateWasy
  const apigatewayController = require('../controllers/apigateway.controller.js'); // Make sure this path is correct

  router.post("/get-usage-plan", apigatewayController.getUsagePlan);

  router.post('/get-usage', apigatewayController.getUsage);
  // apigatewayController.getUsage);
  router.post('/get-api-keys', apigatewayController.getApiKeys);

  router.post('/get-previous-month-usage', apigatewayController.getPreviousMonthUsage);

  app.use('/api', router);

};