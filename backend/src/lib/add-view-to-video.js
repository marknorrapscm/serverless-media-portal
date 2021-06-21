const DynamoFactory = require("./factories/DynamoFactory");
const getVideo = require("./get-video");

module.exports = async videoHash => {
	const video = await getVideo(videoHash);
	const currentViews = video.ViewCount || 0;
	const newViews = Number(currentViews) + 1;

	const res = await updateVideo(videoHash, newViews);

	return res;
};

const updateVideo = async (videoHash, viewCount) => {
	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		const params = {
			TableName: process.env.videoTableName,
			Key: {
				"VideoHash": { S: videoHash }
			},
			UpdateExpression: "set ViewCount = :viewCount",
			ExpressionAttributeValues: {
				":viewCount": { N: viewCount.toString() }
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
