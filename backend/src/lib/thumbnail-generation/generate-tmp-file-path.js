const getRandomString = require("../get-random-string");

/**
 * Takes a string in the format of "xyz-{HASH}" and replaces the
 * {HASH} placeholder with a unique string.
 */
module.exports = filePathTemplate => {
	const hash = getRandomString(10);
	const tmpFilePath = filePathTemplate.replace("{HASH}", hash);

	return tmpFilePath;
};
