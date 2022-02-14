const listAllVideosForUser = require("../../application/videos/list-all-videos-for-user");

module.exports = async (user, numberOfVideos) => {
	const videosForUser = await listAllVideosForUser(user, numberOfVideos);

	if (videosForUser && videosForUser.length > 0) {
		return selectRandomElementsFromArray(videosForUser, numberOfVideos);
	} else {
		return [];
	}
};

const selectRandomElementsFromArray = (arr, numberOfElements) => {
	const videosRandomized = arr.sort(() => 0.5 - Math.random());
	const randomElements = videosRandomized.slice(0, numberOfElements);

	return randomElements;
};
