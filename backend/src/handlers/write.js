const addCommentToVideo = require("../application/add-comment-to-video");
const addTag = require("../persistence/add-tag");
const addViewToVideo = require("../application/add-view-to-video");
const deleteTag = require("../persistence/delete-tag");
const deleteVideo = require("../persistence/delete-video");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const getAuthToken = require("../utility/get-auth-token");
const isUserAnAdmin = require("../application/is-user-an-admin");
const updateVideo = require("../persistence/update-video");

module.exports.addViewToVideo = async event => {
	try {
		const videoHash = event.queryStringParameters.videoHash;
		const res = await addViewToVideo(videoHash);

		if (res.success) {
			return ResponseFactory.getSuccessResponse();
		} else {
			throw Error(res.message);
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.addCommentToVideo = async event => {
	try {
		const body = JSON.parse(event.body);
		const { videoHash, commentText } = body;
		const userHash = getAuthToken(event);

		const res = await addCommentToVideo(videoHash, commentText, userHash);

		if (res.success) {
			return ResponseFactory.getSuccessResponse();
		} else {
			throw Error(res.message);
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.editVideo = async event => {
	try {
		const { video } = JSON.parse(event.body);
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const res = await updateVideo(video);

			if (res.success) {
				return ResponseFactory.getSuccessResponse();
			} else {
				throw Error(res.message);
			}
		} else {
			throw Error("Only admins can edit videos");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.deleteVideo = async event => {
	try {
		const videoHash = event.queryStringParameters.videoHash;
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const res = await deleteVideo(videoHash);

			if (res.success) {
				return ResponseFactory.getSuccessResponse();
			} else {
				throw Error(res.message);
			}
		} else {
			throw Error("Only admins can delete videos");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.addTag = async event => {
	try {
		const { formData } = JSON.parse(event.body);
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const res = await addTag(formData.tag);

			if (res.success) {
				return ResponseFactory.getSuccessResponse();
			} else {
				throw Error(res.message);
			}
		} else {
			throw Error("Only admins can add tags");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};

module.exports.deleteTag = async event => {
	try {
		const tag = event.queryStringParameters.tagName;
		const userHash = getAuthToken(event);

		if (await isUserAnAdmin(userHash)) {
			const res = await deleteTag(tag);

			if (res.success) {
				return ResponseFactory.getSuccessResponse();
			} else {
				throw Error(res.message);
			}
		} else {
			throw Error("Only admins can delete tags");
		}
	} catch (e) {
		return ResponseFactory.getFailureResponse(e.message);
	}
};
