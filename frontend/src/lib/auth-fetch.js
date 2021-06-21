import { getSavedHashFromLocalStorage, saveHashToLocalStorage } from "./local-storage";

const USE_LOCAL = process.env.REACT_APP_useLocalBackend;
const API_GATEWAY_ADDR = process.env.REACT_APP_apiGatewayUrl;
const LOCALHOST_ADDR = process.env.REACT_APP_localhostBackend;

export async function logUserIn(userHashFromLoginForm = undefined) {
	if (userHashFromLoginForm) {
		if (await performLogin(userHashFromLoginForm)) {
			saveHashToLocalStorage(userHashFromLoginForm);
			return true;
		} else {
			return false;
		}
	} else {
		const hashFromLocalStorage = getSavedHashFromLocalStorage();
		if (hashFromLocalStorage) {
			return await performLogin(hashFromLocalStorage);
		} else {
			return false;
		}
	}
}

export async function authFetch(url) {
	const urlToUse = modifyUrlBasedOnSettings(url);
	const hash = getHash();
	const response = await makeRequest(urlToUse, hash, "GET");

	return response;
}

export async function authPost(url, body) {
	const urlToUse = modifyUrlBasedOnSettings(url);
	const hash = getHash();
	const response = await makeRequest(urlToUse, hash, "POST", body);

	return response;
}


const performLogin = async (userHash) => {
	const urlToUse = modifyUrlBasedOnSettings("http://localhost:3001/dev/handshake");
	const response = await makeRequest(urlToUse, userHash, "GET");

	if (response && response.message === "Success") {
		return true;
	} else {
		return false;
	}
};

const modifyUrlBasedOnSettings = url => {
	if (process.env.NODE_ENV === "development" && USE_LOCAL === "true") {
		return url;
	} else {
		return url.replace(LOCALHOST_ADDR, API_GATEWAY_ADDR);
	}
};

const getHash = () => {
	const hash = getSavedHashFromLocalStorage();

	if (hash) {
		return hash;
	} else {
		throw "No saved hash found; user is not logged in";
	}
};

const makeRequest = async (url, hash, method, body) => {
	try {
		const req = {
			method,
			headers: {
				"Authorization": hash
			}
		};

		if (body) {
			req.body = JSON.stringify(body);
		}

		const res = await fetch(url, req);
		const response = await res.json();
		return response;
	} catch (e) {
		console.error(e);
	}
};