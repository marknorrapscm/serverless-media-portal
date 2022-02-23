const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async videoHash => {
	const video = await VideoDao.GetVideo(videoHash);

	return video;
};
