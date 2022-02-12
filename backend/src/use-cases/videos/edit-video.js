const getVideo = require("../../application/videos/get-video");
const updateVideo = require("../../application/videos/update-video");
const VideoModel = require("../../persistence/entity-models/VideoModel");

module.exports = async formData => {
	const existingVideo = await getVideo(formData.VideoHash);

	if (!existingVideo) {
		throw new Error(`Video with hash ${formData.VideoHash} not found`);
	}

	const newVideoModel = new VideoModel({
		...existingVideo,
		Title: formData.Title,
		ViewCount: formData.ViewCount,
		VideoDate: formData.VideoDate,
		Description: formData.Description
	});

	await updateVideo(newVideoModel);
};
