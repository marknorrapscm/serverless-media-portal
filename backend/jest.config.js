const envVars = require("./config/env-vars.json");

module.exports = {
	// force Jest to include files that don't have a test file when generating coverage report
	"collectCoverageFrom": ["src/**/*.{js,jsx}"],
	"collectCoverage": true,
	"coverageReporters": ["html"]
};

// Set the environment variables whenever running Jest
// process.env = Object.assign(process.env, {
// 	...envVars
// });
