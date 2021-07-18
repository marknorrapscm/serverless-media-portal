const validateAuthToken = require("../application/validate-auth-token");

module.exports.authorize = async (event, context, callback) => {
	const authorizeResult = await validateAuthToken(event);

	if (authorizeResult.success) {
		return {
			principalId: "user",
			policyDocument: {
				Version: "2012-10-17",
				Statement: [{
					Action: "execute-api:Invoke",
					Effect: "Allow",
					Resource: event.methodArn
				}]
			}
		};
	} else {
		callback(`Unauthorized: ${authorizeResult.message}`, null);
	}
};
