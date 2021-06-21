const extractItemsFromDynamoResults = require("./extract-items-from-dynamo-results");
const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async userHash => {
	const dynamo = DynamoFactory.getSdk();
	const params = {
		Key: {
			"UserHash": {
				S: userHash
			}
		},
		TableName: process.env.userTableName
	};

	const res = await dynamo.getItem(params).promise();
	const userObj = res && res.Item
		? extractItemsFromDynamoResults(res.Item)
		: undefined;

	return userObj;
};
