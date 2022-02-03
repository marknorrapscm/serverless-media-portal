const addViewToVideo = require("../use-cases/videos/add-view-to-video");
const getVideo = require("../use-cases/videos/get-video");
const listAllVideosForUser = require("../use-cases/videos/list-all-videos-for-user");
const listRandomVideos = require("../use-cases/videos/list-random-videos");
const ResponseFactory = require("../utility/factories/ResponseFactory");

module.exports.listAllVideosForUser = async event => {
	try {
		const videos = await listAllVideosForUser(event.requestContext.authorizer.user);

		return ResponseFactory.getSuccessResponse({ videos });
	} catch (e) {
		return handleErrors("Error in listAllVideos", e);
	}
};

module.exports.getVideo = async event => {
	try {
		const video = await getVideo(event.queryStringParameters.videoHash);

		return ResponseFactory.getSuccessResponse({ video });
	} catch (e) {
		return handleErrors("Error in listAllVideos", e);
	}
};

module.exports.listRandomVideos = async event => {
	try {
		const videos = await listRandomVideos(
			event.requestContext.authorizer.user,
			extractQueryStringParam(event, "count") || 5
		);

		return ResponseFactory.getSuccessResponse({ videos });
	} catch (e) {
		return handleErrors("Error in listAllVideos", e);
	}
};

module.exports.addViewToVideo = async event => {
	try {
		await addViewToVideo(extractQueryStringParam(event, "videoHash"));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

const extractQueryStringParam = (event, paramName) => {
	if (event.queryStringParameters) {
		return event.queryStringParameters[paramName];
	} else {
		return undefined;
	}
};

const handleErrors = async (summaryMsg, error) => {
	console.log(summaryMsg);
	console.log(error);

	return ResponseFactory.getFailureResponse(`${summaryMsg}: ${error.message}`);
};

// module.exports.deleteVideo = async event => {
// 	try {
// 		const videoHash = event.queryStringParameters.videoHash;
// 		const userHash = getAuthToken(event);

// 		if (await isUserAnAdmin(userHash)) {
// 			const res = await deleteVideo(videoHash);

// 			if (res.success) {
// 				return ResponseFactory.getSuccessResponse();
// 			} else {
// 				throw Error(res.message);
// 			}
// 		} else {
// 			throw Error("Only admins can delete videos");
// 		}
// 	} catch (e) {
// 		return ResponseFactory.getFailureResponse(e.message);
// 	}
// };
