const deleteUser = require("../../application/users/delete-user");

module.exports = async userHash => {
	await deleteUser(userHash);
};
