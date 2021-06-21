const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async formData => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.userTableName,
			Key: {
				"UserHash": { S: formData.userHash }
			},
			UpdateExpression: "set DisplayName = :displayName, Tags = :tags",
			ExpressionAttributeValues: {
				":displayName": { S: formData.displayName },
				":tags": {
					"L": formData.tags.map(x => {
						return { "S": x };
					})
				}
			}
		};

		await dynamo.updateItem(params).promise();
		success = true;
	} catch (e) {
		console.error(e);
		success = false;
		message = e.message;
	}

	return { success, message };
};
