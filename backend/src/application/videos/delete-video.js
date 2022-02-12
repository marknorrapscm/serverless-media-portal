const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async videoHash => {
	await VideoDao.DeleteVideo(videoHash);
};
