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

module.exports.listAllVideosForUser = async event => {
	try {
		const videos = await listAllVideosForUser(getUserFromEvent(event));

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
			getUserFromEvent(event),
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

module.exports.editVideo = async event => {
	try {
		const { video } = JSON.parse(event.body);
		await editVideo(video, getUserFromEvent(event));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.deleteVideo = async event => {
	try {
		await deleteVideo(extractQueryStringParam(event, "videoHash"));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.getPresignedUrlForVideoUpload = async event => {
	try {
		const presignedUrl = await getVideoUploadUrl(extractQueryStringParam(event, "fileName"));

		return ResponseFactory.getSuccessResponse({ presignedUrl });
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.addVideo = async event => {
	try {
		const body = JSON.parse(event.body);
		await addVideo(body.formData);

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};
