const getUser = require("../persistence/get-user");

module.exports = async userHash => {
	const user = await getUser(userHash);

	return user.Tags;
};
