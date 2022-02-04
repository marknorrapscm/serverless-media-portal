const getVideo = require("../../application/videos/get-video");
const isUserAuthorizedToViewVideo = require("../../application/videos/is-user-authorized-to-view-video");
const updateVideo = require("../../application/videos/update-video");

module.exports = async (newVideoValues, user) => {
	const video = await getVideo(newVideoValues.VideoHash);

	if (!video) {
		throw new Error(`Video with hash ${newVideoValues.VideoHash} not found`);
	}

	if (isUserAuthorizedToViewVideo(video, user) && validateVideo(newVideoValues)) {
		const newVideo = updateVideoWithNewValues(video, newVideoValues);
		await updateVideo(newVideo);
	} else {
		throw new Error("User not authorized");
	}
};

const validateVideo = newValues => {
	if (!newValues) {
		throw new Error("No video data provided");
	}

	if (!newValues.Title || newValues.Title.length <= 0 || newValues.Title.length > 50) {
		throw new Error("A valid title with max 50 chars must be provided");
	}

	if (!newValues.ViewCount
		|| !Number.isInteger(Number(newValues.ViewCount))
		|| Number(newValues.ViewCount) < 0) {
		throw new Error("View count must be an integer >= 0");
	}

	if (!newValues.VideoDate || Number.isNaN(Date.parse(newValues.VideoDate))) {
		throw new Error("Valid video date must be supplied");
	}

	if (!newValues.Title || newValues.Title.length > 50) {
		throw new Error("A valid title with max 50 chars must be provided");
	}

	if (newValues.Description && newValues.Description.length > 5000) {
		throw new Error("Optional description cannot exceed 5000 chars");
	}

	return true;
};

const updateVideoWithNewValues = (existingVideo, newValues) => {
	const newVideo = JSON.parse(JSON.stringify(existingVideo));
	newVideo.Title = newValues.Title;
	newVideo.ViewCount = newValues.ViewCount;
	newVideo.VideoDate = newValues.VideoDate;
	newVideo.Description = newValues.Description;

	return newVideo;
};
