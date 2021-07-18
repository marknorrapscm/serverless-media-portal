const ResponseFactory = require("../utility/factories/ResponseFactory");
const getAuthToken = require("../utility/get-auth-token");
const getUploadUrl = require("../application/get-upload-url");
const isUserAnAdmin = require("../application/is-user-an-admin");
const makeThumbnail = require("../application/thumbnail-generation/make-thumbnail");
const writeVideoToDynamo = require("../persistence/write-video-to-dynamo");

module.exports.getPresignedUrlForVideoUpload = async event => {
	try {
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const fileName = event.queryStringParameters.fileName;
			const bucketName = process.env.videoBucketName;
			const res = await getUploadUrl(fileName, bucketName);

			return ResponseFactory.getSuccessResponse({ uploadTarget: res });
		} else {
			throw Error("Only admins can upload videos");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.submitForm = async event => {
	try {
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const body = JSON.parse(event.body);
			const res = await writeVideoToDynamo(body.formData);

			if (res.success) {
				return ResponseFactory.getSuccessResponse();
			} else {
				throw Error(`Error writing to DynamoDB: ${res.message}`);
			}
		} else {
			throw Error("Only admins can upload videos");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.thumbnailMaker = async event => {
	await makeThumbnail(event);
};
