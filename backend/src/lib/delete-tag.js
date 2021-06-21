const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async tagName => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.tagTableName,
			Key: {
				"TagName": { S: tagName }
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
