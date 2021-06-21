export default (str = new Date()) => {
	const date = new Date(str);
	const year = date.getFullYear();
	// const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	// const hours = date.getHours().toString().padStart(2, "0");
	// const minutes = date.getMinutes().toString().padStart(2, "0");
	// const seconds = date.getSeconds().toString().padStart(2, "0");
	// const atSymbol = showAtSymbol ? " @ " : " ";

	const monthName = date.toLocaleString("default", { month: "long" });
    
	return `${monthName} ${day}, ${year}`;
};