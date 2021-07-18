const AWS = require("aws-sdk");

module.exports = class DynamoFactory {
	static getSdk() {
		const sdk = new AWS.DynamoDB();

		return sdk;
	}
};
