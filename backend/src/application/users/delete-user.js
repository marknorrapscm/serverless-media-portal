const UserDao = require("../../persistence/daos/UserDao");

module.exports = async userHash => {
	return UserDao.DeleteUser(userHash);
};
