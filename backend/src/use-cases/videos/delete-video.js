const deleteVideo = require("../../application/videos/delete-video");
const getVideo = require("../../application/videos/get-video");

module.exports = async videoHash => {
	const video = await getVideo(videoHash);

	if (!video) {
		throw new Error(`No video with hash ${videoHash} found`);
	}

	await deleteVideo(
		videoHash,
		video.VideoFileName,
		generateThumbnailNames(video.VideoFileName)
	);
};

const generateThumbnailNames = videoFileName => {
	return [
		`${stripExtensionFromName(videoFileName)}-0.jpg`,
		`${stripExtensionFromName(videoFileName)}-1.jpg`,
		`${stripExtensionFromName(videoFileName)}-2.jpg`
	];
};

const stripExtensionFromName = name => {
	const arr = name.split(".");

	return arr.slice(0, arr.length - 1);
};
