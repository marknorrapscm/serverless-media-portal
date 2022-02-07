const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async videoHash => {
	const video = await VideoDao.DeleteVideo(videoHash);

	return video;
};
