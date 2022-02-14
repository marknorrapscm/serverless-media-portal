const getRandomString = require("../../utility/get-random-string");

module.exports = class VideoModel {
	constructor(data) {
		if (!data) {
			throw new Error("No video data provided");
		}

		if (!data.Title || data.Title.length <= 0 || data.Title.length > 50) {
			throw new Error("A valid title with max 50 chars must be provided");
		}

		if (!data.ViewCount) {
			this.ViewCount = 0;
		} else if (!Number.isInteger(Number(data.ViewCount)) || Number(data.ViewCount) < 0) {
			throw new Error("View count must be an integer >= 0");
		} else {
			this.ViewCount = data.ViewCount;
		}

		if (!data.VideoHash) {
			this.VideoHash = getRandomString(11);
		} else if (data.VideoHash.length !== 11) {
			throw new Error("VideoHash must be 11 characters");
		} else {
			this.VideoHash = data.VideoHash;
		}

		if (!data.UploadedOn) {
			this.UploadedOn = new Date().toISOString();
		} else if (Number.isNaN(Date.parse(data.UploadedOn))) {
			throw new Error("UploadedOn must be a valid date");
		} else {
			this.UploadedOn = data.UploadedOn;
		}

		if (!data.VideoDate || Number.isNaN(Date.parse(data.VideoDate))) {
			throw new Error("Valid video date must be supplied");
		}

		if (data.Description && data.Description.length > 5000) {
			throw new Error("Optional description cannot exceed 5000 chars");
		}

		if (!data.Duration) {
			throw new Error("VideoModel must have a duration");
		}

		if (!data.Tags || !Array.isArray(data.Tags) || data.Tags.Length === 0) {
			throw new Error("VideoModel requires one or more tags to be set");
		}

		if (!data.VideoFileName) {
			throw new Error("VideoModel requires a VideoFileName");
		}

		if (!data.ThumbnailName) {
			throw new Error("VideoModel requires a ThumbnailName");
		}

		this.Description = data.Description || "";
		this.VideoDate = data.VideoDate;
		this.Title = data.Title;
		this.Duration = data.Duration;
		this.Tags = data.Tags;
		this.VideoFileName = data.VideoFileName;
		this.ThumbnailName = data.ThumbnailName;
		this.Comments = data.Comments;
	}
};
