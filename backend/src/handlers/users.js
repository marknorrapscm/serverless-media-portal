const { extractQueryStringParam, handleErrors } = require("../utility/request-helpers");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const listUsers = require("../use-cases/users/list-users");
const addUser = require("../use-cases/users/add-user");
const editUser = require("../use-cases/users/edit-user");
const deleteUser = require("../use-cases/users/delete-user");

module.exports.listUsers = async () => {
	try {
		const users = await listUsers();

		return ResponseFactory.getSuccessResponse({ users });
	} catch (e) {
		return handleErrors("Error in listUsers", e);
	}
};

module.exports.addUser = async event => {
	try {
		const { formData } = JSON.parse(event.body);
		const users = await addUser(formData);

		return ResponseFactory.getSuccessResponse({ users });
	} catch (e) {
		return handleErrors("Error in addUser", e);
	}
};

module.exports.editUser = async event => {
	try {
		const { formData } = JSON.parse(event.body);
		const users = await editUser(formData);

		return ResponseFactory.getSuccessResponse({ users });
	} catch (e) {
		return handleErrors("Error in editUser", e);
	}
};

module.exports.deleteUser = async event => {
	try {
		await deleteUser(extractQueryStringParam(event, "userHash"));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in deleteUser", e);
	}
};
