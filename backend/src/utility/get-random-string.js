module.exports = length => {
	return randomString(length);
};

/**
 * Adapted from:
 * https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
 */
const randomString = len => {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";

	for (let i = len; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}

	return result;
};
