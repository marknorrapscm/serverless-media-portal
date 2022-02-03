const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async newVideo => {
	await VideoDao.UpdateVideo(newVideo);
};
