const doesFileExist = require("./does-file-exist");
const downloadVideoToTmpDirectory = require("./download-video-to-tmp-directory");
const generateThumbnailsFromVideo = require("./generate-thumbnails-from-video");

// Don't edit these
const THUMBNAILS_TO_CREATE = 3;

module.exports = async event => {
	const { videoFileName, triggerBucketName } = extractParams(event);
	const tmpVideoPath = await downloadVideoToTmpDirectory(triggerBucketName, videoFileName);

	if (doesFileExist(tmpVideoPath)) {
		await generateThumbnailsFromVideo(tmpVideoPath, THUMBNAILS_TO_CREATE, videoFileName);
	}
};

const extractParams = event => {
	const videoFileName = decodeURIComponent(event.Records[0].s3.object.key).replace(/\+/g, " ");
	const triggerBucketName = event.Records[0].s3.bucket.name;

	return { videoFileName, triggerBucketName };
};
