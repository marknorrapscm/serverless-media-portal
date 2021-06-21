const DynamoFactory = require("./factories/DynamoFactory");
const extractItemsFromDynamoResults = require("./extract-items-from-dynamo-results");

module.exports = async videoHash => {
	const res = await getVideoFromDynamo(videoHash);

	if (res.Item) {
		const video = extractItemsFromDynamoResults(res.Item);
		return video;
	} else {
		throw Error(`No video with hash ${videoHash} found`);
	}
};

const getVideoFromDynamo = async videoHash => {
	const dynamo = DynamoFactory.getSdk();
	const params = {
		Key: {
			"VideoHash": {
				S: videoHash
			}
		},
		TableName: process.env.videoTableName
	};

	const res = await dynamo.getItem(params).promise();

	return res;
};
