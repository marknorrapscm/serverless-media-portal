module.exports = async (video, user) => {
	const isUserAnAdmin = user.Tags.includes("Admin");
	const isUserAuthorized = video.Tags.some(x => user.Tags.includes(x));

	return isUserAnAdmin || isUserAuthorized;
};
