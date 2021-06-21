const DynamoFactory = require("./factories/DynamoFactory");
const extractItemsFromDynamoResults = require("./extract-items-from-dynamo-results");
const getTagsAvailableToUser = require("./get-tags-available-to-user");

module.exports = async userHash => {
	const videos = await getVideos(userHash);
	const tags = await getTagsAvailableToUser(userHash);
	const videosForUser = filterVideosByTag(videos, tags);

	return videosForUser;
};

const getVideos = async () => {
	const scanResults = [];
	const dynamo = DynamoFactory.getSdk();

	const performScan = async params => {
		const res = await dynamo.scan(params).promise();
		const videos = extractItemsFromDynamoResults(res.Items);
		scanResults.push(...videos);

		if (res.LastEvaluatedKey) {
			await performScan({
				...params,
				ExclusiveStartKey: res.LastEvaluatedKey
			});
		}
	};

	await performScan({ TableName: process.env.videoTableName });

	return scanResults;
};

const filterVideosByTag = (videos, tags) => {
	if (tags.includes("Admin")) {
		return videos;
	} else {
		return videos.filter(x => x.Tags.some(y => tags.includes(y)));
	}
};
