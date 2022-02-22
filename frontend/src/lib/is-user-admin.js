import { authGet } from "./auth-fetch";

export default async () => {
	const res = await authGet("http://localhost:3001/dev/isUserAnAdmin");

	if (res && res.isUserAnAdmin === true) {
		return true;
	} else {
		return false;
	}
};
