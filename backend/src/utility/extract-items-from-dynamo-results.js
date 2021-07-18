const AWS = require("aws-sdk");

/**
 * Takes DynamoDB query results - either as an array of as a
 * single item - and extracts their values from the DynamoDB
 * JSON syntax.
 *
 * @param dynamoResult Eiter one or an array of DynamoDB query results
 */
module.exports = dynamoResult => {
	if (Array.isArray(dynamoResult)) {
		return performExtractionOnArray(dynamoResult);
	} else if (typeof dynamoResult === "object") {
		return AWS.DynamoDB.Converter.unmarshall(dynamoResult);
	} else {
		throw Error("Invalid parameter passed to extractItemsFromDynamoResult()");
	}
};

const performExtractionOnArray = arrayOfDynamoItems => {
	const results = arrayOfDynamoItems.map(item => AWS.DynamoDB.Converter.unmarshall(item));

	return results;
};
