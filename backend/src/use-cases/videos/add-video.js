const addVideo = require("../../application/videos/add-video");
const AddVideoModel = require("../../persistence/entity-models/AddVideoModel");

module.exports = async formData => {
	const addVideoModel = new AddVideoModel(formData);

	await addVideo(addVideoModel);
};
