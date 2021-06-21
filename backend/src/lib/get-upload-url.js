const S3Factory = require("./factories/S3Factory");

module.exports = async (fileName, bucketName) => {
	try {
		const res = await getUploadURL(fileName, bucketName);

		return res;
	} catch (e) {
		console.error(e);
	}
};

// Refactor this when it's working
const getUploadURL = async (fileName, bucketName) => {
	const fileNameWithExtension = fileName.includes(".mp4")
		? fileName
		: `${fileName}.mp4`;

	const s3 = S3Factory.getSdk();
	const s3Params = {
		Bucket: bucketName,
		Key: fileNameWithExtension,
		Expires: 300,
		ContentType: "video/mp4",
		ACL: "public-read"
	};
	const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

	return {
		uploadUrl,
		fileNameWithExtension
	};
};
