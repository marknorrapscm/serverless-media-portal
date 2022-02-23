const addUser = require("../../application/users/add-user.js");
const getUser = require("../../application/users/get-user");
const UserModel = require("../../persistence/entity-models/UserModel");

module.exports = async formData => {
	const existingUser = await getUser(formData.UserHash);

	if (!existingUser) {
		throw new Error(`User with hash ${formData.UserHash} not found`);
	}

	const newUserModel = new UserModel({
		...existingUser,
		DisplayName: formData.DisplayName,
		Tags: formData.Tags
	});

	await addUser(newUserModel);
};
