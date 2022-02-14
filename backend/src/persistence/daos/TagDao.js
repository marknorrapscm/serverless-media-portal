const Dynamo = require("../storage/DynamoDb");

const PRIMARY_KEY = "TagName";

module.exports = class TagDao {
	static async ListAllTags() {
		return new Dynamo().GetAllRowsFromTable(
			process.env.tagTableName
		);
	}

	static async AddTag(tag) {
		return new Dynamo().AddItemToTable(
			process.env.tagTableName, {
				[PRIMARY_KEY]: tag
			}
		);
	}

	static async DeleteTag(tag) {
		return new Dynamo().DeleteRowFromTable(
			process.env.tagTableName,
			PRIMARY_KEY,
			tag
		);
	}
};
