const getAuthToken = require("../utility/get-auth-token");
const getUser = require("../persistence/get-user");

module.exports = async event => {
	const result = {
		success: false,
		message: ""
	};

	const authorizationToken = getAuthToken(event);
	const userObj = await getUser(authorizationToken);

	if (!userObj) {
		result.message = "Invalid user hash supplied";
	} else {
		result.success = true;
	}

	return result;
};
