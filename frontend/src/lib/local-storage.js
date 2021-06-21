const localStorageKeyName = "mp_hash";

export const saveHashToLocalStorage = hash => {
	const obj = {
		hash: hash,
		expiresOn: new Date(new Date().getTime()+(7*24*3600*1000)) // 7 days from now
	};

	window.localStorage.setItem(localStorageKeyName, JSON.stringify(obj));
};

export const getSavedHashFromLocalStorage = () => {
	let hash;
	const dataFromLocalStorage = window.localStorage.getItem(localStorageKeyName);

	if(dataFromLocalStorage) {
		const obj = JSON.parse(dataFromLocalStorage);

		if(new Date() < new Date(obj.expiresOn)) {
			hash = obj.hash;
		} else {
			console.error("Hash is no longer valid");
		}
	}

	return hash;
};

export const clearSavedHash = () => {
	window.localStorage.removeItem(localStorageKeyName);
};