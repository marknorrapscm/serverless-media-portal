const Dynamo = require("../storage/DynamoDb");
const { marshall } = require("../../utility/marshalling");

const PRIMARY_KEY = "UserHash";

module.exports = class UserDao {
	static async ListUsers() {
		return new Dynamo().GetAllRowsFromTable(process.env.userTableName);
	}

	static async AddUser(user) {
		const params = {
			TableName: process.env.userTableName,
			Item: marshall(user)
		};

		await new Dynamo()
			.GetSdk()
			.putItem(params)
			.promise();

		return true;
	}

	static async GetUser(userHash) {
		return new Dynamo().GetRecordFromTable(
			process.env.userTableName,
			PRIMARY_KEY,
			userHash
		);
	}

	static async DeleteUser(userHash) {
		return new Dynamo().DeleteRowFromTable(
			process.env.userTableName,
			PRIMARY_KEY,
			userHash
		);
	}
};
