const fs = require("fs");
const S3Factory = require("../factories/S3Factory");
const generateTmpFilePath = require("./generate-tmp-file-path");

module.exports = async (triggerBucketName, videoFileName) => {
	const downloadResult = await getVideoFromS3(triggerBucketName, videoFileName);
	const videoAsBuffer = downloadResult.Body;
	const tmpVideoFilePath = await saveFileToTmpDirectory(videoAsBuffer);

	return tmpVideoFilePath;
};

const getVideoFromS3 = async (triggerBucketName, fileName) => {
	const s3 = S3Factory.getSdk();
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
