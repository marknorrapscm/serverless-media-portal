const addVideo = require("../../application/videos/add-video");
const VideoModel = require("../../persistence/entity-models/VideoModel");

module.exports = async formData => {
	const videoModel = new VideoModel(formData);

	await addVideo(videoModel);
};
