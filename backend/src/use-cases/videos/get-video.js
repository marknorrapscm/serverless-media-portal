const getVideo = require("../../application/videos/get-video");

module.exports = async videoHash => {
	if (!isHashValid(videoHash)) {
		throw new Error("Video hashes must be alphanumeric");
	}

	const video = await getVideo(videoHash);

	return video;
};

const isHashValid = str => {
	return new RegExp(/^[a-zA-Z0-9]+$/).test(str);
};
