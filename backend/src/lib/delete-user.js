const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async userHash => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.userTableName,
			Key: {
				"UserHash": { S: userHash }
			}
		};

		await dynamo.deleteItem(params).promise();
		success = true;
	} catch (e) {
		console.error(e);
		success = false;
		message = e.message;
	}

	return { success, message };
};
