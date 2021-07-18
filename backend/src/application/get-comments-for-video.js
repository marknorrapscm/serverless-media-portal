const getVideo = require("../persistence/get-video");
const isUserAuthorizedToViewVideo = require("../application/is-user-authorized-to-view-video");

module.exports = async (videoHash, authorizationToken) => {
	try {
		const video = await getVideo(videoHash);

		if (await isUserAuthorizedToViewVideo(video, authorizationToken)) {
			return video.Comments;
		} else {
			throw Error(`User is not authorized to view comments on this video (${videoHash})`);
		}
	} catch (e) {
		console.error(e);
	}
};
