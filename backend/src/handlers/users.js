const { extractQueryStringParam, getUserFromEvent, handleErrors } = require("../utility/request-helpers");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const listUsers = require("../use-cases/users/list-users");
const addUser = require("../use-cases/users/add-user");

module.exports.listUsers = async () => {
	try {
		const users = await listUsers();

		return ResponseFactory.getSuccessResponse({ users });
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.addUser = async event => {
	try {
		const { formData } = JSON.parse(event.body);
		const users = await addUser(formData);

		return ResponseFactory.getSuccessResponse({ users });
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};
