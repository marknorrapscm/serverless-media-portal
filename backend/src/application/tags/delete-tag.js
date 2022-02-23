const TagDao = require("../../persistence/daos/TagDao");

module.exports = async tag => {
	await TagDao.DeleteTag(tag);
};
