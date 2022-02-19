const VideoDao = require("../../persistence/daos/VideoDao");
const S3 = require("../../persistence/storage/S3");

module.exports = async (videoHash, videoFileName, thumbnailNames) => {
	const s3 = new S3();

	const deleteVideoTableRowPromise = VideoDao.DeleteVideo(videoHash);
	const deleteVideoFilePromise = s3.DeleteVideo(videoFileName);
	const deleteThumbnailPromises = thumbnailNames.map(x => s3.DeleteThumbnail(x));

	await Promise.allSettled([
		deleteVideoTableRowPromise,
		deleteVideoFilePromise,
		...deleteThumbnailPromises
	]);
};
