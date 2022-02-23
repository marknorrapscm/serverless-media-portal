const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async user => {
	const allVideos = await VideoDao.ListAllVideos();
	const videosWithTargetTags = filterVideosByTag(allVideos, user.Tags);

	return videosWithTargetTags;
};

const filterVideosByTag = (videos, tags) => {
	if (tags.includes("Admin")) {
		return videos;
	} else {
		return videos.filter(x => x.Tags.some(y => tags.includes(y)));
	}
};
