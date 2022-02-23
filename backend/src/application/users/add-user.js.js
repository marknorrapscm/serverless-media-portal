const UserDao = require("../../persistence/daos/UserDao");

module.exports = async user => {
	return UserDao.AddUser(user);
};
