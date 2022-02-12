const AWS = require("aws-sdk");
const extractItemsFromDynamoResults = require("../../utility/extract-items-from-dynamo-results");
const { unmarshall, marshall } = require("../../utility/marshalling");

module.exports = class Dynamo {
	constructor() {
		this.sdk = new AWS.DynamoDB();
	}

	GetSdk() {
		return this.sdk;
	}

	async GetRecordFromTable(tableName, key, value) {
		const params = {
			Key: { ...marshall({ [key]: value }) },
			TableName: tableName
		};

		const res = await this.sdk.getItem(params).promise();

		return res && res.Item
			? unmarshall(res.Item)
			: undefined;
	}

	async AddItemToTable(tableName, item) {
		const params = {
			TableName: tableName,
			Item: marshall(item)
		};

		await this.sdk.putItem(params).promise();
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

	async DeleteRowFromTable(tableName, key, value) {
		const params = {
			Key: { ...marshall({ [key]: value }) },
			TableName: tableName
		};

		await this.sdk.deleteItem(params).promise();
	}
};
