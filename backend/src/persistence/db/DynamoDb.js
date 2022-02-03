const AWS = require("aws-sdk");
const extractItemsFromDynamoResults = require("../../utility/extract-items-from-dynamo-results");

module.exports = class Dynamo {
	constructor() {
		this.sdk = new AWS.DynamoDB();
	}

	GetSdk() {
		return this.sdk;
	}

	async GetRecordFromTable(tableName, key, value) {
		const params = {
			Key: { ...AWS.DynamoDB.Converter.marshall({ [key]: value }) },
			TableName: tableName
		};

		const res = await this.sdk.getItem(params).promise();

		return res && res.Item
			? AWS.DynamoDB.Converter.unmarshall(res.Item)
			: undefined;
	}

	async GetAllRowsFromTable(tableName) {
		const scanResults = [];

		const recursiveScan = async params => {
			const res = await this.sdk.scan(params).promise();

			if (res && res.Items) {
				scanResults.push(...extractItemsFromDynamoResults(res.Items));
			}

			if (res && res.LastEvaluatedKey) {
				await recursiveScan({
					...params,
					ExclusiveStartKey: res.LastEvaluatedKey
				});
			}
		};

		await recursiveScan({ TableName: tableName });

		return scanResults;
	}
};
