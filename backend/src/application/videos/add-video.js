const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async addVideoModel => {
	return VideoDao.AddVideo(addVideoModel);
};
