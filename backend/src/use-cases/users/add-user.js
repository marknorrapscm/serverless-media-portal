const addUser = require("../../application/users/add-user.js");
const listUsers = require("../../application/users/list-users");
const UserModel = require("../../persistence/entity-models/UserModel.js");

module.exports = async formData => {
	const userModel = new UserModel(formData);

	return addUser(userModel);
};
