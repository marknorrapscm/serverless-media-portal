const getVideo = require("../../application/videos/get-video");
const isUserAuthorizedToViewVideo = require("../../application/videos/is-user-authorized-to-view-video");

module.exports = async (videoHash, user) =>{
	const video = await getVideo(videoHash);

	if (!video) {
		throw new Error(`No video found with hash ${ videoHash}`);
	} else if (!isUserAuthorizedToViewVideo(video, user)) {
		throw new Error(`User is not authorized to interact with video ${videoHash}`);
	}

	return video.Comments;
};
