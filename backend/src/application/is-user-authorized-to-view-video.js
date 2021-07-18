const getTagsAvailableToUser = require("./get-tags-available-to-user");

module.exports = async (video, authorizationToken) => {
	const tagsAvailableToUser = await getTagsAvailableToUser(authorizationToken);
	const isUserAnAdmin = tagsAvailableToUser.includes("Admin");
	const isUserAuthorized = video.Tags.some(x => tagsAvailableToUser.includes(x));

	return isUserAnAdmin || isUserAuthorized;
};
