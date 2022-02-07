const getRandomString = require("../../utility/get-random-string");
const IVideoModel = require("./IVideoModel");

/**
 * Need to add more validation below
 *
 * I recognise that VideoFileName and ThumbnailFileName are bad names
 * considering they're actually URLs; it's too late to change it.
 */

module.exports = class AddVideoModel extends IVideoModel {
	constructor(data) {
		super(data);

		if (!data.Duration) {
			throw new Error("AddVideoModel must have a duration");
		} else {
			this.Duration = data.Duration;
		}

		if (!data.Tags || !Array.isArray(data.Tags) || data.Tags.Length === 0) {
			throw new Error("AddVideoModel requires one or more tags to be set");
		} else {
			this.Tags = data.Tags;
		}

		if (!data.VideoFileName) {
			throw new Error("AddVideoModel requires a VideoFileName");
		} else {
			this.VideoFileName = data.VideoFileName;
		}

		if (!data.ThumbnailName) {
			throw new Error("AddVideoModel requires a ThumbnailName");
		} else {
			this.ThumbnailName = data.ThumbnailName;
		}

		this.VideoHash = getRandomString(11);
		this.UploadedOn = new Date().toISOString();
	}
};
