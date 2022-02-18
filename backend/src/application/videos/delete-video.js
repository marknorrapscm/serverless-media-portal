const VideoDao = require("../../persistence/daos/VideoDao");
const S3 = require("../../persistence/storage/S3");

module.exports = async videoHash => {
	const video = await VideoDao.GetVideo(videoHash);
	const s3 = new S3();

	const deleteVideoTableRowPromise = VideoDao.DeleteVideo(videoHash);
	const deleteVideoFilePromise = s3.DeleteVideo(video.VideoFileName);
	const deleteThumbnailPromises = generateThumbnailNames(video).map(x => s3.DeleteThumbnail(x));

	await Promise.allSettled([
		deleteVideoTableRowPromise,
		deleteVideoFilePromise,
		...deleteThumbnailPromises
	]);
};

const generateThumbnailNames = video => {
	return [
		`${stripExtensionFromName(video.VideoFileName)}-0.jpg`,
		`${stripExtensionFromName(video.VideoFileName)}-1.jpg`,
		`${stripExtensionFromName(video.VideoFileName)}-2.jpg`
	];
};

const stripExtensionFromName = name => {
	const arr = name.split(".");

	return arr.slice(0, arr.length - 1);
};
