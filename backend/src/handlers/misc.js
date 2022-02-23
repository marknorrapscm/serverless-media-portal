const makeThumbnail = require("../application/misc/thumbnail-generation/make-thumbnail");
const runAfterDeploy = require("../use-cases/misc/run-after-deploy");
const ResponseFactory = require("../utility/factories/ResponseFactory");

module.exports.handshake = async () => {
	return ResponseFactory.getSuccessResponse();
};

module.exports.thumbnailMaker = async event => {
	await makeThumbnail(event);
};

module.exports.runAfterDeploy = async event => {
	await runAfterDeploy();

	return {
		Message: "Below are the 3 properties you'll need to add to the frontend's .env file:",
		ImageCloudfrontDomain: process.env.imageCloudfrontDomain,
		VideoCloudfrontDomain: process.env.videoCloudfrontDomain,
		ApiGatewayUrl: process.env.apiGatewayUrl
	};
};
