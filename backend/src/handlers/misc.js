const makeThumbnail = require("../application/misc/thumbnail-generation/make-thumbnail");
const ResponseFactory = require("../utility/factories/ResponseFactory");

module.exports.handshake = async () => {
	return ResponseFactory.getSuccessResponse();
};

module.exports.thumbnailMaker = async event => {
	await makeThumbnail(event);
};
