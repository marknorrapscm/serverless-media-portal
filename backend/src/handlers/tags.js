const { extractQueryStringParam, getUserFromEvent, handleErrors } = require("../utility/request-helpers");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const listAllTags = require("../use-cases/tags/list-all-tags");
const addTag = require("../use-cases/tags/add-tag");
const deleteTag = require("../use-cases/tags/delete-tag");
const isUserAnAdmin = require("../use-cases/users/is-user-an-admin");

module.exports.listAllTags = async () => {
	try {
		const tags = await listAllTags();

		return ResponseFactory.getSuccessResponse({ tags });
	} catch (e) {
		return handleErrors("Error in listAllTags", e);
	}
};

module.exports.isUserAnAdmin = async event => {
	try {
		const user = getUserFromEvent(event);
		const res = isUserAnAdmin(user);

		return ResponseFactory.getSuccessResponse({ isUserAnAdmin: res });
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
		await deleteTag(extractQueryStringParam(event, "tagName"));

		return ResponseFactory.getSuccessResponse();
	} catch (e) {
		return handleErrors("Error in deleteTag", e);
	}
};
