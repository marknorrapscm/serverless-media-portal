const getUser = require("./get-user");

module.exports = async userHash => {
	const user = await getUser(userHash);

	return user.Tags;
};
