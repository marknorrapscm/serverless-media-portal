const addCommentToVideo = require("../persistence/add-comment-to-video");
const getRandomString = require("../utility/get-random-string");
const getUser = require("../persistence/get-user");

module.exports = async (videoHash, commentText, userHash) => {
	if (!videoHash || !commentText || !userHash) {
		throw Error("commentText, videoHash or userHash not supplied");
	}

	const user = await getUser(userHash);
	const commentHash = getRandomString(11);
	const res = await addCommentToVideo(
		videoHash,
		commentHash,
		commentText,
		user.DisplayName
	);

	return res;
};
