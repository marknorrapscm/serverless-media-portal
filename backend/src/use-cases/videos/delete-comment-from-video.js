const addVideo = require("../../application/videos/add-video");
const getVideo = require("../../application/videos/get-video");
const isUserAuthorizedToViewVideo = require("../../application/videos/is-user-authorized-to-view-video");
const VideoModel = require("../../persistence/entity-models/VideoModel");

module.exports = async (videoHash, commentHash, user) => {
	const existingVideo = await getExistingVideo(videoHash, user);
	const commentToDelete = getCommentFromVideo(existingVideo, commentHash);

	if (!isUserAuthorizedToDeleteComment(commentToDelete, commentHash, user)) {
		throw new Error(`User is not authorized to delete comment ${commentHash} on video ${videoHash}`);
	}

	const videoWithCommentRemoved = deleteCommentFromVideo(existingVideo, commentHash);
	await addVideo(videoWithCommentRemoved);
};

const getExistingVideo = async (videoHash, user) => {
	const existingVideo = await getVideo(videoHash);

	if (!isUserAuthorizedToViewVideo(existingVideo, user)) {
		throw new Error(`User is not authorized to interact with video ${videoHash}`);
	} else if (!existingVideo) {
		throw new Error(`No video found with hash ${videoHash}`);
	}

	return existingVideo;
};

const getCommentFromVideo = (existingVideo, commentHash) =>{
	const comment = existingVideo.Comments.find(x => x.CommentHash === commentHash);

	if (!comment) {
		throw new Error(`No comment ${commentHash} found`);
	}

	return comment;
};

const isUserAuthorizedToDeleteComment = (commentToDelete, commentHash, user) => {
	if (user.Tags.includes("Admin")) {
		return true;
	}

	/**
	 * In order versions, SMP did not store the userHash of commenters. For backwards
	 * compatibility, we will also allow users to delete comments if they have the same
	 * display name of the person who made it.
	 */
	if (commentToDelete.UserHash === user.UserHash
		|| commentToDelete.UserDisplayName === user.UserDisplayName) {
		return true;
	} else {
		return false;
	}
};

const deleteCommentFromVideo = (existingVideo, commentHash) => {
	return new VideoModel({
		...existingVideo,
		Comments: existingVideo.Comments.filter(x => x.CommentHash !== commentHash)
	});
};
