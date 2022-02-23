const addTag = require("../../application/tags/add-tag");

module.exports = async formData => {
	if (!formData || !formData.Tag) {
		throw new Error("Invalid or no tag specified");
	}

	const tag = `${formData.Tag}`;

	await addTag(tag);
};
