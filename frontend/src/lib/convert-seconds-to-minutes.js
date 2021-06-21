export default (seconds) => {
	if(!seconds) {
		return "00:00";
	}
	
	const fullMinutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
    
	const isZeroSuffixRequiredForMinutes = (`${fullMinutes}`).length === 1;
	const isZeroSuffixRequiredForSeconds = (`${remainingSeconds}`).length === 1;

	const minutesStr = isZeroSuffixRequiredForMinutes ? `0${fullMinutes}` : `${fullMinutes}`;
	const secondsStr = isZeroSuffixRequiredForSeconds ? `0${remainingSeconds}` : `${remainingSeconds}`;

	return `${minutesStr}:${secondsStr}`;
};
