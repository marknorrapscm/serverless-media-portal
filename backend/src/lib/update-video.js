const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async video => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.videoTableName,
			Key: {
				"VideoHash": { S: video.VideoHash }
			},
			UpdateExpression: "set Title = :title, Description = :description, ViewCount = :viewCount, VideoDate = :videoDate",
			ExpressionAttributeValues: {
				":title": { S: video.Title },
				":description": { S: video.Description },
				":viewCount": { N: video.ViewCount },
				":videoDate": { S: video.VideoDate }
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
