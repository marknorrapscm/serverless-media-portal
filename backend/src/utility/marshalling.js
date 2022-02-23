const AWS = require("aws-sdk");

module.exports.marshall = AWS.DynamoDB.Converter.marshall;
module.exports.unmarshall = AWS.DynamoDB.Converter.unmarshall;
