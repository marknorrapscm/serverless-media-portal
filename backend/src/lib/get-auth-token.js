module.exports = function (event) {
	if (typeof event === "string") {
		return event;
	} else if (event.authorizationToken) {
		return event.authorizationToken;
	} else {
		return event.headers.Authorization;
	}
};
