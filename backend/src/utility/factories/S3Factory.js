const AWS = require("aws-sdk");

module.exports = class S3Factory {
	static getSdk() {
		const sdk = new AWS.S3();

		return sdk;
	}
};
