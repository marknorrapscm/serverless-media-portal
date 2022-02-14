const addViewToVideo = require("../use-cases/videos/add-view-to-video");
const editVideo = require("../use-cases/videos/edit-video");
const getVideo = require("../use-cases/videos/get-video");
const listAllVideosForUser = require("../use-cases/videos/list-all-videos-for-user");
const listRandomVideos = require("../use-cases/videos/list-random-videos");
const { extractQueryStringParam, getUserFromEvent, handleErrors } = require("../utility/request-helpers");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const getVideoUploadUrl = require("../application/videos/get-video-upload-url");
const addVideo = require("../use-cases/videos/add-video");
const deleteVideo = require("../use-cases/videos/delete-video");
const getCommentsForVideo = require("../use-cases/videos/get-comments-for-video");
const addCommentToVideo = require("../use-cases/videos/add-comment-to-video");
const deleteCommentFromVideo = require("../use-cases/videos/delete-comment-from-video");

module.exports.listAllVideosForUser = async event => {
	try {
		const videos = await listAllVideosForUser(getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse({ videos });
	} catch (e) {
		return handleErrors("Error in listAllVideosForUser", e);
	}
};

module.exports.getVideo = async event => {
	try {
		const videoHash = extractQueryStringParam(event, "videoHash");
		const video = await getVideo(videoHash, getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse({ video });
	} catch (e) {
		return handleErrors("Error in getVideo", e);
	}
};

module.exports.listRandomVideos = async event => {
	try {
		const videos = await listRandomVideos(
			getUserFromEvent(event),
			extractQueryStringParam(event, "count") || 5
		);

		return ResponseFactory.getSuccessResponse({ videos });
	} catch (e) {
		return handleErrors("Error in listRandomVideos", e);
	}
};

module.exports.addViewToVideo = async event => {
	try {
		const videoHash = extractQueryStringParam(event, "videoHash");
		await addViewToVideo(videoHash, getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in addViewToVideo", e);
	}
};

module.exports.editVideo = async event => {
	try {
		const { video } = JSON.parse(event.body);
		await editVideo(video, getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in editVideo", e);
	}
};

module.exports.deleteVideo = async event => {
	try {
		await deleteVideo(extractQueryStringParam(event, "videoHash"));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in deleteVideo", e);
	}
};

module.exports.getPresignedUrlForVideoUpload = async event => {
	try {
		const presignedUrl = await getVideoUploadUrl(extractQueryStringParam(event, "fileName"));

		return ResponseFactory.getSuccessResponse({ presignedUrl });
	} catch (e) {
		return handleErrors("Error in getPresignedUrlForVideoUpload", e);
	}
};

module.exports.addVideo = async event => {
	try {
		const body = JSON.parse(event.body);
		await addVideo(body.formData);

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in addVideo", e);
	}
};

module.exports.getCommentsForVideo = async event => {
	try {
		const videoHash = extractQueryStringParam(event, "videoHash");
		const comments = await getCommentsForVideo(videoHash, getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse({ comments });
	} catch (e) {
		return handleErrors("Error in getCommentsForVideo", e);
	}
};

module.exports.addCommentToVideo = async event => {
	try {
		const { formData } = JSON.parse(event.body);
		const user = getUserFromEvent(event);

		await addCommentToVideo(formData, user);

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in addCommentToVideo", e);
	}
};

module.exports.deleteCommentFromVideo = async event => {
	try {
		const videoHash = extractQueryStringParam(event, "videoHash");
		const commentHash = extractQueryStringParam(event, "commentHash");
		const user = getUserFromEvent(event);

		await deleteCommentFromVideo(videoHash, commentHash, user);

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in deleteCommentFromVideo", e);
	}
};
