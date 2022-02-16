const ResponseFactory = require("./factories/ResponseFactory");

module.exports.extractQueryStringParam = (event, paramName) => {
	if (event.queryStringParameters) {
		return event.queryStringParameters[paramName];
	} else {
		return undefined;
	}
};

module.exports.handleErrors = async (summaryMsg, error) => {
	console.log(summaryMsg);
	console.log(error);

	return ResponseFactory.getFailureResponse(`${summaryMsg}: ${error.message}`);
};

module.exports.getAuthToken = event => {
	if (typeof event === "string") {
		return event;
	} else if (event.authorizationToken) {
		return event.authorizationToken;
	} else {
		return event.headers.Authorization;
	}
};

module.exports.getUserFromEvent = event => JSON.parse(event.requestContext.authorizer.user);
