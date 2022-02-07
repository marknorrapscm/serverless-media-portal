const getUser = require("../persistence/get-user");
const { getAuthToken } = require("../utility/request-helpers");

/**
 * Refactor this to use the new /application/get-user.js
 */

module.exports.authorizeUser = async (event, context, callback) => {
	const userObj = await getUserFromRequest(event);

	if (userObj) {
		return getAllowPolicy(event.methodArn, userObj);
	} else {
		callback("Unauthorized", null);
	}
};

module.exports.authorizeAdmin = async (event, context, callback) => {
	const userObj = await getUserFromRequest(event);

	if (isUserAnAdmin(userObj)) {
		return getAllowPolicy(event.methodArn, userObj);
	} else {
		callback("Unauthorized", null);
	}
};

const getUserFromRequest = async event => {
	const authorizationToken = getAuthToken(event);
	return getUser(authorizationToken);
};

const isUserAnAdmin = userObj => userObj
	&& userObj.Tags
	&& userObj.Tags.includes("Admin");

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
			"user": userObj
		}
	};
};
