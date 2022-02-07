const AWS = require("aws-sdk");

module.exports = class S3 {
	constructor() {
		this.sdk = new AWS.S3();
	}

	GetSdk() {
		return this.sdk;
	}

	async GetPresignedUploadUrl(fileNameWithExtension, bucketName) {
		const s3Params = {
			Bucket: bucketName,
			Key: fileNameWithExtension,
			Expires: 300,
			ContentType: "video/mp4",
			ACL: "public-read"
		};
		const uploadUrl = await this.sdk.getSignedUrlPromise("putObject", s3Params);

		return uploadUrl;
	}
};
