const createAdminTag = require("../../application/misc/create-admin-tag");
const createDefaultAdminUser = require("../../application/misc/create-default-admin-user");
const doAnyUsersExist = require("../../application/misc/do-any-users-exist");
const doesAdminTagExist = require("../../application/misc/does-admin-tag-exist");

module.exports = async () => {
	if (!await doAnyUsersExist()) {
		await createDefaultAdminUser();
	}

	if (!await doesAdminTagExist()) {
		await createAdminTag();
	}
};
