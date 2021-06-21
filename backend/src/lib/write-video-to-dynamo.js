const DynamoFactory = require("./factories/DynamoFactory");
const getRandomString = require("./get-random-string");

module.exports = async params => {
	if (!params) {
		throw Error("No params were supplied to writeVideoToDynamo()");
	}

	let success;
	let message;

	try {
		const dynamo = DynamoFactory.getSdk();
		await dynamo.putItem({
			TableName: process.env.videoTableName,
			Item: {
				VideoHash: { "S": getRandomString(11) },
				UploadedOn: { "S": new Date().toISOString() },
				VideoFileName: { "S": params.videoFileName },
				VideoDate: { "S": params.videoDate },
				Title: { "S": params.title },
				Description: { "S": params.description },
				Duration: { "N": params.duration },
				ThumbnailName: { "S": params.thumbnailName },
				Tags: {
					"L": params.tags.map(x => {
						return { S: x };
					})
				}
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
