const S3 = require("../../persistence/storage/S3");

module.exports = async fileName => {
	const fileNameWithExtension = fileName.includes(".mp4")
		? fileName
		: `${fileName}.mp4`;

	const presignedUrl = await new S3().GetPresignedUrlForVideoUpload(fileNameWithExtension);

	return presignedUrl;
};
