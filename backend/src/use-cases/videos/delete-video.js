const deleteVideo = require("../../application/videos/delete-video");

module.exports = async videoHash => {
	if (!isHashValid(videoHash)) {
		throw new Error("Video hashes must be alphanumeric");
	}

	await deleteVideo(videoHash);
};

const isHashValid = str => {
	return new RegExp(/^[a-zA-Z0-9]+$/).test(str);
};
