const getVideosForUser = require("../lib/get-videos-for-user");
const getVideo = require("../lib/get-video");
const getAuthToken = require("../lib/get-auth-token");
const getTagsAvailableToUser = require("../lib/get-tags-available-to-user");
const getEverythingInTable = require("../lib/get-everything-in-table");
const ResponseFactory = require("../lib/factories/ResponseFactory");
const getCommentsForVideo = require("../lib/get-comments-for-video");
const isUserAnAdmin = require("../lib/is-user-an-admin");
const isUserAuthorizedToViewVideo = require("../lib/is-user-authorized-to-view-video");

module.exports.handshake = async () => {
	return ResponseFactory.getSuccessResponse({ message: "Success" });
};

module.exports.listVideos = async event => {
	const authorizationToken = getAuthToken(event);
	const videos = await getVideosForUser(authorizationToken);

	return ResponseFactory.getSuccessResponse({ videos: videos });
};

module.exports.getVideo = async event => {
	try {
		const authorizationToken = getAuthToken(event);
		const videoHash = event.queryStringParameters.videoHash;
		const video = await getVideo(videoHash);

		if (await isUserAuthorizedToViewVideo(video, authorizationToken)) {
			return ResponseFactory.getSuccessResponse({ video: video });
		} else {
			throw Error("User is not authorized to view this video");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.listRandomVideos = async event => {
	const authorizationToken = getAuthToken(event);
	const numberOfVideos = event.queryStringParameters.count || 5;

	const allVideos = await getVideosForUser(authorizationToken);
	const videosRandomized = allVideos.sort(() => 0.5 - Math.random());
	const videos = videosRandomized.slice(0, numberOfVideos);

	return ResponseFactory.getSuccessResponse({ videos: videos });
};

module.exports.getTagsForUser = async event => {
	const authorizationToken = getAuthToken(event);
	const tags = await getTagsAvailableToUser(authorizationToken);

	return ResponseFactory.getSuccessResponse({ tags: tags });
};

module.exports.getAllTags = async event => {
	const authorizationToken = getAuthToken(event);

	if (await isUserAnAdmin(authorizationToken)) {
		const tags = await getEverythingInTable(process.env.tagTableName);
		return ResponseFactory.getSuccessResponse({ tags: tags });
	} else {
		return ResponseFactory.getFailureResponse("User is not authorized to view all tags");
	}
};

module.exports.getCommentsForVideo = async event => {
	const videoHash = event.queryStringParameters.videoHash;
	const authorizationToken = getAuthToken(event);
	const comments = await getCommentsForVideo(videoHash, authorizationToken);

	if (comments) {
		return ResponseFactory.getSuccessResponse({ comments: comments });
	} else {
		return ResponseFactory.getFailureResponse("No comments found");
	}
};
