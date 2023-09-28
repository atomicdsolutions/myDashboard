const AWS = require('aws-sdk');
const db = require("../models");
require('dotenv').config();
const Client = db.client;
const logger = require('../middleware/logger');

const credentials = new AWS.SharedIniFileCredentials({ profile: process.env.PROFILE });
AWS.config.credentials = credentials;
AWS.config.update({ region: process.env.REGION });

let assumedCredentials = null;

// Function to assume role and get temporary credentials
const assumeRoleAndGetCredentials = (callback) => {
  const sts = new AWS.STS();
  const roleToAssume = {
    RoleArn: process.env.ROLE_ARN,
    RoleSessionName: process.env.ROLE_SESSION_NAME
  };
 
  logger.info(`Attempting to assume role with ARN: ${process.env.ROLE_ARN}`, { label: 'AWS STS' });
 
  sts.assumeRole(roleToAssume, (err, data) => {
    if (err) {
      logger.error('Error assuming role:', { label: 'AWS STS', error: err });
      callback(err, null);
      return;
    }

    logger.info(`Successfully assumed role with ARN: ${process.env.ROLE_ARN}`, { label: 'AWS STS' });
    callback(null, {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken
    });
  });
};


// Function to create a new API Gateway instance with assumed credentials
const createApiGateway = () => {
  // Check if credentials have expired
  const currentTime = new Date().getTime();
  const expiryTime = new Date(assumedCredentials.expiration || 0).getTime();

  if (currentTime >= expiryTime) {
    // Refresh credentials
    assumeRoleAndGetCredentials((err, newCredentials) => {
      if (err) {
        logger.error('Error assuming role:', { label: 'AWS GATEWAY: ASSUMED ROLE', error: err });
        // console.log('Error assuming role:', err);
        return;
      }
      assumedCredentials = newCredentials;
      AWS.config.update(assumedCredentials);
    });
  }

  return new AWS.APIGateway({ credentials: assumedCredentials });
};

// Assume the role once and store the credentials
assumeRoleAndGetCredentials((err, credentials) => {
  if (err) {
    logger.error('Error assuming role:', { label: 'AWS ASSUMED ROLE', error: err });
    // console.log('Error assuming role:', err);
    return;
  }
  assumedCredentials = credentials;
  AWS.config.update(assumedCredentials);
});

exports.getUsagePlan = async (req, res) => {
  // const usagePlanId = req.body.usagePlanId;
  // console.log("Usage Plan ID:", usagePlanId);
  try {
    const apigateway = createApiGateway();
    var params = {
      keyId: req.body.awsApikey,
      limit: 4
    };
    apigateway.getUsagePlans(params, (err, usagePlanData) => {
      if (err) {
        logger.error('Error retrieving usage plan:', { label: 'AWS USAGEPALNs', error:  err.message });
        // console.log('Error retrieving usage plan:', err.message);
        return res.status(500).send('Error retrieving usage plan');
      } else {
        return res.json(usagePlanData);
      }
    });
  } catch (err) {
    logger.error(err.message, { label: 'AWS USAGEPALNs' });
    return res.status(500).send(err.message);
  }
};

exports.getUsage = (req, res) => {
  try {
    const apikey = req.body.awsApikey;
    const usagePlanId = req.body.awsApiUsagePlan;
    // console.log(req.body);
    if (!apikey || !usagePlanId) {
      logger.error('Both apikey and usagePlanId are required in the request body', { label: 'AWS USAGE' });
      return res.status(400).send('Both apikey and usagePlanId are required in the request body');
    }

    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    const params = {
      usagePlanId: usagePlanId,
      keyId: apikey,
      startDate: startDate,
      endDate: endDate,
      limit: 1000
    };

    const apigateway = createApiGateway();
    apigateway.getUsage(params, (err, usageData) => {
      if (err) {
        logger.error('Error retrieving usage data:', err.message, { label: 'AWS GETUSAGE' });
        // console.log('Error retrieving usage data:', err.message);
        return res.status(500).send('Error retrieving usage data');
      } else {
        const usagePlanItems = usageData.items[params.keyId];
        return res.json({ data: usagePlanItems });
      }
    });
  } catch (err) {
    logger.error(err.message, { label: 'AWS USAGE' });
    return res.status(500).send(err.message);
  }
};




exports.getApiKeys = (req, res) => {

  const apigateway = createApiGateway();
  const params = {
    limit: 1000,
    includeValues: true
  };
  apigateway.getApiKeys(params, (err, apiKeysData) => {

    if (err) {
      logger.error('Error retrieving API keys:', err);
      // console.log('Error retrieving API keys:', err);
      res.status(500).send('Error retrieving API keys');
    }
    else {
      // console.log(apiKeysData);
      res.json(apiKeysData);
    }

  });

};

// Function to get the previous month's usage
exports.getPreviousMonthUsage = (req, res) => {
  logger.info(req.body);
  try {
    const apikey = req.body.awsApikey;
    const usagePlanId = req.body.awsApiUsagePlan;
    console.log(req.body);
    if (!apikey || !usagePlanId) {
      logger.error('Both apikey and usagePlanId are required in the request body');
      return res.status(400).send('Both apikey and usagePlanId are required in the request body');
    }

    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    const params = {
      usagePlanId: usagePlanId,
      keyId: apikey,
      startDate: startDate,
      endDate: endDate,
      limit: 1000
    };
    console.log(params);
    const apigateway = createApiGateway();
    apigateway.getUsage(params, (err, usageData) => {
      if (err) {
        logger.error('Error retrieving previous month usage data:', err);
        // console.log('Error retrieving previous month usage data:', err.message);
        return res.status(500).send('Error retrieving previous month usage data');
      } else {
        const usagePlanItems = usageData.items[params.keyId];
        return res.json({ data: usagePlanItems });
      }
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send(err.message);
  }
};
