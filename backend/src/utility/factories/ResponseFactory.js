module.exports = class ResponseFactory {
	static getSuccessResponse(body) {
		return {
			statusCode: 200,
			headers: this.getHeaders(),
			body: JSON.stringify({ success: true, ...body }, null, 2)
		};
	}

	static getFailureResponse(message) {
		return {
			statusCode: 400,
			headers: this.getHeaders(),
			body: JSON.stringify({ success: false, message: message }, null, 2)
		};
	}

	static getHeaders() {
		return {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true
		};
	}
};
