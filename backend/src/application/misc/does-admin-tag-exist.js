const Dynamo = require("../../persistence/storage/DynamoDb");

module.exports = async () => {
	const res = await new Dynamo().GetRecordFromTable(
		process.env.tagTableName,
		"TagName",
		"Admin"
	);

	if (res) {
		return true;
	} else {
		return false;
	}
};
