module.exports = class UserModel {
	constructor(data) {
		if (!data) {
			throw new Error("No video data provided");
		}

		if (!data.UserHash) {
			throw new Error("A UserHash must be supplied");
		}

		if (!data.DisplayName || data.DisplayName.length > 75) {
			throw new Error("A DisplayName with max length of 75 characters is required");
		}

		if (!data.Tags) {
			this.Tags = [];
		} else if (!Array.isArray(data.Tags)) {
			throw new Error("Tags must be an array of strings");
		} else {
			this.Tags = data.Tags;
		}

		this.UserHash = data.UserHash;
		this.DisplayName = data.DisplayName;
	}
};
