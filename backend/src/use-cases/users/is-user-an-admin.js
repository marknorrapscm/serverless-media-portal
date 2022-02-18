module.exports = user => {
	if (!user) {
		throw new Error("No user was specified");
	}

	if (!user.Tags || user.Tags.length === 0) {
		return false;
	}

	return user.Tags.includes("Admin");
};
