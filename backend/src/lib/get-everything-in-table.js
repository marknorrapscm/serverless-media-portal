const DynamoFactory = require("./factories/DynamoFactory");
const extractItemsFromDynamoResults = require("./extract-items-from-dynamo-results");

module.exports = async tableName => {
	const items = await loadEverythingFromTable(tableName);

	return items;
};

const loadEverythingFromTable = async tableName => {
	const scanResults = [];
	const dynamo = DynamoFactory.getSdk();

	const performScan = async params => {
		const res = await dynamo.scan(params).promise();
		const items = extractItemsFromDynamoResults(res.Items);
		scanResults.push(...items);

		if (res.LastEvaluatedKey) {
			await performScan({
				...params,
				ExclusiveStartKey: res.LastEvaluatedKey
			});
		}
	};

	await performScan({ TableName: tableName });

	return scanResults;
};
