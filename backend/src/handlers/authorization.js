const getUser = require("../persistence/get-user");
const getAuthToken = require("../utility/get-auth-token");

module.exports.authorizeUser = async (event, context, callback) => {
	const authorizationToken = getAuthToken(event);
	const userObj = await getUser(authorizationToken);

	if (userObj) {
		return getAllowPolicy(event.methodArn, userObj);
	} else {
		callback("Unauthorized", null);
	}
};

module.exports.authorizeAdmin = async (event, context, callback) => {
	const authorizationToken = getAuthToken(event);
	const userObj = await getUser(authorizationToken);

	if (isUserAnAdmin(userObj)) {
		return getAllowPolicy(event.methodArn, userObj);
	} else {
		callback("Unauthorized", null);
	}
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
