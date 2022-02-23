const deleteTag = require("../../application/tags/delete-tag");

module.exports = async tag => {
	if (tag === "Admin") {
		throw new Error("The Admin tag cannot be deleted");
	}

	await deleteTag(tag);
};
