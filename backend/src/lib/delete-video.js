const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async videoHash => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.videoTableName,
			Key: {
				"VideoHash": { S: videoHash }
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
