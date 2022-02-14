const addVideo = require("../../application/videos/add-video");
const getVideo = require("../../application/videos/get-video");
const isUserAuthorizedToViewVideo = require("../../application/videos/is-user-authorized-to-view-video");

module.exports = async (videoHash, user) => {
	const existingVideo = await getExistingVideo(videoHash, user);
	const newVideo = addSingleViewToVideo(existingVideo);
	const res = await addVideo(newVideo);

	return res;
};

const getExistingVideo = async (videoHash, user) => {
	const existingVideo = await getVideo(videoHash);

	if (!isUserAuthorizedToViewVideo(existingVideo, user)) {
		throw new Error(`User is not authorized to interact with video ${videoHash}`);
	} else if (!existingVideo) {
		throw new Error(`No video found with hash ${videoHash}`);
	}

	return existingVideo;
};

const addSingleViewToVideo = video => {
	const newVideo = JSON.parse(JSON.stringify(video));
	const currentViews = newVideo.ViewCount || 0;
	newVideo.ViewCount = (Number(currentViews) + 1).toString();

	return newVideo;
};
