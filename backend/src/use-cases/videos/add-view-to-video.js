const getVideo = require("../../application/videos/get-video");
const updateVideo = require("../../application/videos/update-video");
const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async videoHash => {
	const video = await getVideo(videoHash);
	const newVideo = addSingleViewToVideo(video);
	const res = await updateVideo(newVideo);

	return res;
};

const addSingleViewToVideo = video => {
	const newVideo = JSON.parse(JSON.stringify(video));
	const currentViews = newVideo.ViewCount || 0;
	newVideo.ViewCount = (Number(currentViews) + 1).toString();

	return newVideo;
};
