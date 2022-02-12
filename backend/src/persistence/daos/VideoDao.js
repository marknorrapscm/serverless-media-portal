const Dynamo = require("../storage/DynamoDb");

const PRIMARY_KEY = "VideoHash";

module.exports = class VideoDao {
	static async GetVideo(videoHash) {
		return new Dynamo().GetRecordFromTable(
			process.env.videoTableName,
			PRIMARY_KEY,
			videoHash
		);
	}

	static async ListAllVideos() {
		return new Dynamo().GetAllRowsFromTable(
			process.env.videoTableName
		);
	}

	static async GetVideosVisibleWithTags(tagList) {
		//
	}

	static async DeleteVideo(videoHash) {
		return new Dynamo().DeleteRowFromTable(
			process.env.videoTableName,
			"VideoHash",
			videoHash
		);
	}

	static async AddVideo(videoModel) {
		return new Dynamo().AddItemToTable(
			process.env.videoTableName,
			videoModel
		);
	}

	static async UpdateVideo(video) {
		const params = {
			TableName: process.env.videoTableName,
			Key: {
				[PRIMARY_KEY]: { S: video.VideoHash }
			},
			UpdateExpression: "set Title = :title, Description = :description, ViewCount = :viewCount, VideoDate = :videoDate",
			ExpressionAttributeValues: {
				":title": { S: video.Title },
				":description": { S: video.Description },
				":viewCount": { N: video.ViewCount },
				":videoDate": { S: video.VideoDate }
			}
		};

		await new Dynamo()
			.GetSdk()
			.updateItem(params)
			.promise();
	}
};
