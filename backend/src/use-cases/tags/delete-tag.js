const deleteTag = require("../../application/tags/delete-tag");

module.exports = async tag => {
	await deleteTag(tag);
};
