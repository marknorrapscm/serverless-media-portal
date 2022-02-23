const authorizeAdmin = require("../use-cases/authorization/authorize-admin");
const authorizeUser = require("../use-cases/authorization/authorize-user");
const { getAuthToken } = require("../utility/request-helpers");

module.exports.authorizeUser = async (event, context, callback) => {
	try {
		const res = await authorizeUser(getAuthToken(event));

		if (res.authorized) {
			return getAllowPolicy(event.methodArn, res.userObj);
		} else {
			throw new Error("User not authorized");
		}
	} catch (e) {
		logError(e, event, "authorizeUser");
		callback("Unauthorized", null);
	}
};

module.exports.authorizeAdmin = async (event, context, callback) => {
	try {
		const res = await authorizeAdmin(getAuthToken(event));

		if (res.authorized) {
			return getAllowPolicy(event.methodArn, res.userObj);
		} else {
			throw new Error("User not authorized");
		}
	} catch (e) {
		logError(e, event, "authorizeAdmin");
		callback("Unauthorized", null);
	}
};

const getAllowPolicy = (methodArn, userObj) => {
	return {
		principalId: "user",
		policyDocument: {
			Version: "2012-10-17",
			Statement: [{
				Action: "execute-api:Invoke",
				Effect: "Allow",
				Resource: methodArn
			}]
		},
		context: {
			"user": JSON.stringify(userObj)
		}
	};
};

const logError = (error, event, handler) => {
	console.log(`Unauthorized user in ${handler}`);
	console.log(error);
	console.log(event);
};
