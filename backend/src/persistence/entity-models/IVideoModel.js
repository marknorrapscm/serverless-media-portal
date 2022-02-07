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

		if (!data.VideoDate || Number.isNaN(Date.parse(data.VideoDate))) {
			throw new Error("Valid video date must be supplied");
		}

		if (data.Description && data.Description.length > 5000) {
			throw new Error("Optional description cannot exceed 5000 chars");
		}

		this.Description = data.Description;
		this.VideoDate = data.VideoDate;
		this.Title = data.Title;
	}
};
