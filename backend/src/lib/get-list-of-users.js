const extractItemsFromDynamoResults = require("./extract-items-from-dynamo-results");
const DynamoFactory = require("./factories/DynamoFactory");

module.exports = async () => {
	const users = await getAllUsers();

	return users;
};

const getAllUsers = async () => {
	const scanResults = [];
	const dynamo = DynamoFactory.getSdk();

	const performScan = async params => {
		const res = await dynamo.scan(params).promise();
		const users = extractItemsFromDynamoResults(res.Items);
		scanResults.push(...users);

		if (res.LastEvaluatedKey) {
			await performScan({
				...params,
				ExclusiveStartKey: res.LastEvaluatedKey
			});
		}
	};

	await performScan({ TableName: process.env.userTableName });

	return scanResults;
};
