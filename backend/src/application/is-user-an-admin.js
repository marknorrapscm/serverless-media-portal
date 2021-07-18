const getTagsAvailableToUser = require("./get-tags-available-to-user");

module.exports = async authorizationToken => {
	const tagsAvailableToUser = await getTagsAvailableToUser(authorizationToken);
	const isUserAdmin = tagsAvailableToUser.includes("Admin");

	return isUserAdmin;
};
