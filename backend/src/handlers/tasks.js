const AWS = require("aws-sdk");

/**
 * This function runs after a deploy to AWS is made. It prints important URLs / names of the assets
 * that were created during the deploy to the console. We take these and reference them as
 * environment variables in both the backend and frontend. It also creates a default user if needed.
 */
module.exports.runAfterDeploy = async event => {
	await createDefaultSettings();

	return {
		ApiGatewayUrl: process.env.apiGatewayUrl,
		Region: process.env.region,
		Stage: process.env.stage,
		ImageBucketName: process.env.generatedImageBucketName,
		VideoBucketName: process.env.generatedVideoBucketName,
		ImageCloudfrontDomain: process.env.imageCloudfrontDomain,
		VideoCloudfrontDomain: process.env.videoCloudfrontDomain
	};
};

const createDefaultSettings = async () => {
	if (!await doAnyUsersExist()) {
		await createDefaultAdminUser();
	}

	if (!await doesAdminTagExist()) {
		await createAdminTag();
	}
};

const doAnyUsersExist = async () => {
	const userTableName = process.env.userTableName;
	const dynamo = new AWS.DynamoDB();
	const res = await dynamo.scan({ TableName: userTableName }).promise();

	if (res && res.Count > 0) {
		return true;
	} else {
		return false;
	}
};

const createDefaultAdminUser = async () => {
	const dynamo = new AWS.DynamoDB();
	const params = {
		TableName: process.env.userTableName,
		Item: {
			// Hash for: temporaryadminuser/0001-01-01/password
			UserHash: { S: "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi" },
			DisplayName: { S: "Temporary Admin User" },
			Tags: {
				"L": [{
					"S": "Admin"
				}]
			}
		}
	};

	await dynamo.putItem(params).promise();

	return true;
};

const doesAdminTagExist = async () => {
	const userTableName = process.env.tagTableName;
	const dynamo = new AWS.DynamoDB();
	const res = await dynamo.scan({ TableName: userTableName }).promise();

	return res.Items.some(x => x.TagName.S === "Admin");
};

const createAdminTag = async () => {
	const dynamo = new AWS.DynamoDB();
	const params = {
		TableName: process.env.tagTableName,
		Item: {
			TagName: { S: "Admin" }
		}
	};

	await dynamo.putItem(params).promise();

	return true;
};
