/* eslint-disable no-restricted-syntax */
const AWS = require("aws-sdk");
const { unmarshall } = AWS.DynamoDB.Converter;

/**
 * Takes DynamoDB query results - either as an array of as a
 * single item - and extracts their values from the DynamoDB
 * JSON syntax.
 *
 * @param dynamoResult Eiter one or an array of DynamoDB query results
 */
module.exports = dynamoResult => {
	if (Array.isArray(dynamoResult)) {
		return dynamoResult.map(x => recursivelyExtractItems(x));
	} else {
		return unmarshall(dynamoResult);
	}
};

const recursivelyExtractItems = dynamoResult => {
	const res = unmarshall(dynamoResult);

	for (const [key, value] of Object.entries(dynamoResult)) {
		if (Array.isArray(value)) {
			res[key] = value.map(x => recursivelyExtractItems(x));
		}
	}

	return res;
};
