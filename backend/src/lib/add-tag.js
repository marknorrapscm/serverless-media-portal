const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async tagName => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		await dynamo.putItem({
			TableName: process.env.tagTableName,
			Item: {
				TagName: { "S": tagName }
			}
		}).promise();

		success = true;
	} catch (e) {
		console.error(e);
		success = false;
		message = e.message;
	}

	return { success, message };
};
