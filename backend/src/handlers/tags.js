const { extractQueryStringParam, getUserFromEvent, handleErrors } = require("../utility/request-helpers");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const listAllTags = require("../use-cases/tags/list-all-tags");
const addTag = require("../use-cases/tags/add-tag");
const deleteTag = require("../use-cases/tags/delete-tag");

module.exports.listAllTags = async () => {
	try {
		const tags = await listAllTags();

		return ResponseFactory.getSuccessResponse({ tags });
	} catch (e) {
		return handleErrors("Error in listAllTags", e);
	}
};

module.exports.getTagsForUser = async event => {
	try {
		const user = getUserFromEvent(event);

		return ResponseFactory.getSuccessResponse({ tags: user.Tags });
	} catch (e) {
		return handleErrors("Error in getTagsForUser", e);
	}
};

module.exports.addTag = async event => {
	try {
		const body = JSON.parse(event.body);
		await addTag(body.formData);

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in addTag", e);
	}
};

module.exports.deleteTag = async event => {
	try {
		const user = deleteTag(extractQueryStringParam(event, "tagName"));

		return ResponseFactory.getSuccessResponse({ tags: user.Tags });
	} catch (e) {
		return handleErrors("Error in deleteTag", e);
	}
};
