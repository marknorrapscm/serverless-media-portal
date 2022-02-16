const Dynamo = require("../../persistence/storage/DynamoDb");

module.exports = async () => {
	const res = await new Dynamo()
		.GetSdk()
		.scan({ TableName: process.env.userTableName })
		.promise();

	return res && res.Count > 0;
};
