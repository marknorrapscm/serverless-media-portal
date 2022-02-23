const TagDao = require("../../persistence/daos/TagDao");

module.exports = async () => {
	return TagDao.ListAllTags();
};
