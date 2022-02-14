const listAllVideosForUser = require("../../application/videos/list-all-videos-for-user");

module.exports = async user => {
	return listAllVideosForUser(user);
};
