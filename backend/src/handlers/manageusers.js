const ResponseFactory = require("../lib/factories/ResponseFactory");
const getListOfUsers = require("../lib/get-list-of-users");
const updateUser = require("../lib/update-user");
const deleteUser = require("../lib/delete-user");

module.exports.listUsers = async event => {
	const users = await getListOfUsers();
	return ResponseFactory.getSuccessResponse({ users: users });
};

module.exports.updateUser = async event => {
	const body = JSON.parse(event.body);
	if (!body.formData) {
		return ResponseFactory.getFailureResponse("formData was not supplied");
	}

	const res = await updateUser(body.formData);

	if (res.success) {
		return ResponseFactory.getSuccessResponse();
	} else {
		return ResponseFactory.getFailureResponse(`Error writing to DynamoDB: ${res.message}`);
	}
};

module.exports.addUser = async event => {
	const body = JSON.parse(event.body);
	if (!body.formData) {
		return ResponseFactory.getFailureResponse("formData was not supplied");
	}

	const res = await updateUser(body.formData);

	if (res.success) {
		return ResponseFactory.getSuccessResponse();
	} else {
		return ResponseFactory.getFailureResponse(`Error writing to DynamoDB: ${res.message}`);
	}
};

module.exports.deleteUser = async event => {
	const userHash = event.queryStringParameters.userHash;
	if (!userHash) {
		return ResponseFactory.getFailureResponse("userHash was not supplied");
	}

	const res = await deleteUser(userHash);

	if (res.success) {
		return ResponseFactory.getSuccessResponse();
	} else {
		return ResponseFactory.getFailureResponse(`Error writing to DynamoDB: ${res.message}`);
	}
};
