/**
 * Function taken (and tidied up) from:
 * https://stackoverflow.com/a/53800501/5819046
 */

const units = {
	year: 24 * 60 * 60 * 1000 * 365,
	month: 24 * 60 * 60 * 1000 * 365 / 12,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const getRelativeTime = (d1, d2 = new Date()) => {
	const elapsed = d1 - d2;

	for (const u in units) {
		if (Math.abs(elapsed) > units[u] || u == "second") {
			return rtf.format(Math.round(elapsed / units[u]), u);
		}
	}
};

export default (date) => {
	const isIsoString = typeof date === "string";
	if (isIsoString) {
		return getRelativeTime(new Date(date));
	} else {
		return getRelativeTime(date);
	}
};