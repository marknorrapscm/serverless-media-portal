const UserDao = require("../../persistence/daos/UserDao");

module.exports = async userHash => {
	const video = await UserDao.GetUser(userHash);

	return video;
};
