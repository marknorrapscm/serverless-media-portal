const fs = require("fs");
const S3 = require("../../../persistence/storage/S3");
const generateTmpFilePath = require("./generate-tmp-file-path");

module.exports = async (triggerBucketName, videoFileName) => {
	const downloadResult = await getVideoFromS3(triggerBucketName, videoFileName);
	const videoAsBuffer = downloadResult.Body;
	const tmpVideoFilePath = await saveFileToTmpDirectory(videoAsBuffer);

	return tmpVideoFilePath;
};

const getVideoFromS3 = async (triggerBucketName, fileName) => {
	const s3 = new S3().GetSdk();
	const res = await s3.getObject({
		Bucket: triggerBucketName,
		Key: fileName
	}).promise();

	return res;
};

const saveFileToTmpDirectory = async fileAsBuffer => {
	const tmpVideoPathTemplate = "/tmp/vid-{HASH}.mp4";
	const tmpVideoFilePath = generateTmpFilePath(tmpVideoPathTemplate);
	await fs.promises.writeFile(tmpVideoFilePath, fileAsBuffer, "base64");

	return tmpVideoFilePath;
};
