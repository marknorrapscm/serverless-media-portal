const Dynamo = require("../../persistence/storage/DynamoDb");

module.exports = async () => {
	await new Dynamo().AddItemToTable(
		process.env.userTableName,
		{
			UserHash: "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi",
			DisplayName: "Temporary Admin User",
			Tags: ["Admin"]
		}
	);
};
