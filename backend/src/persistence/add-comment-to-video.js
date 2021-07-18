const DynamoFactory = require("../lib/factories/DynamoFactory");

module.exports = async (videoHash, commentHash, commentText, userDisplayName) => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.videoTableName,
			Key: {
				"VideoHash": { S: videoHash }
			},
			UpdateExpression: "SET Comments = list_append(if_not_exists(Comments, :newEmptyList), :newComment)",
			ExpressionAttributeValues: {
				":newComment": {
					"L": [{
						"M": {
							"CommentHash": { S: commentHash },
							"UserDisplayName": { S: userDisplayName },
							"CommentText": { S: commentText },
							"CreatedOn": { "S": new Date().toISOString() }
						}
					}]
				},
				":newEmptyList": {
					"L": []
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
