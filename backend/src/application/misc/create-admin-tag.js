const Dynamo = require("../../persistence/storage/DynamoDb");

module.exports = async () => {
	await new Dynamo().AddItemToTable(process.env.tagTableName, {
		TagName: "Admin"
	});
};
