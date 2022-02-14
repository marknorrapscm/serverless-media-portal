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
			PRIMARY_KEY,
			videoHash
		);
	}

	static async AddVideo(videoModel) {
		return new Dynamo().AddItemToTable(
			process.env.videoTableName,
			videoModel
		);
	}
};
