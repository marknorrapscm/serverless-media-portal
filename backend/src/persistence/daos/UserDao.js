const Dynamo = require("../storage/DynamoDb");
const { marshall } = require("../../utility/marshalling");

const PRIMARY_KEY = "UserHash";

module.exports = class UserDao {
	static async ListUsers() {
		return new Dynamo().GetAllRowsFromTable(process.env.userTableName);
	}

	static async AddUser(user) {
		console.log("user");
		console.log(user);
		const params = {
			TableName: process.env.userTableName,
			Item: marshall(user)
			// Item: {
			// // Hash for: temporaryadminuser/0001-01-01/password
			// 	UserHash: { S: "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi" },
			// 	DisplayName: { S: "Temporary Admin User" },
			// 	Tags: {
			// 		"L": [{
			// 			"S": "Admin"
			// 		}]
			// 	}
			// }
		};

		await new Dynamo()
			.GetSdk()
			.putItem(params)
			.promise();

		return true;
	}
};
