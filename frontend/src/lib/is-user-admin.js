import { authFetch } from "./auth-fetch";

export default async () => {
	const res = await authFetch("http://localhost:3001/dev/getTagsForUser");

	if (res && res.tags && res.tags.includes("Admin")) {
		return true;
	} else {
		return false;
	}
};
