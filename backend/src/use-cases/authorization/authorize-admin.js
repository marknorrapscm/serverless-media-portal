const getUser = require("../../application/users/get-user");

module.exports = async userHash => {
	const res = {
		authorized: false
	};

	const user = await getUser(userHash);

	if (user && isUserAnAdmin(user)) {
		res.authorized = true;
		res.userObj = user;
	}

	return res;
};

const isUserAnAdmin = userObj => userObj
	&& userObj.Tags
	&& userObj.Tags.includes("Admin");
