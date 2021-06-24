/* eslint-disable no-await-in-loop */
const fs = require("fs");
const { spawnSync, exec } = require("child_process");
const S3Factory = require("../factories/S3Factory");
const doesFileExist = require("./does-file-exist");
const generateTmpFilePath = require("./generate-tmp-file-path");

const ffprobePath = "/opt/bin/ffprobe";
const ffmpegPath = "/opt/bin/ffmpeg";

module.exports = async (tmpVideoPath, numberOfThumbnailsToCreate, videoFileName) => {
	const durationInSeconds = getVideoDuration(tmpVideoPath);
	const randomTimes = generateRandomTimes(durationInSeconds, numberOfThumbnailsToCreate);

	for (let i = 0; i < randomTimes.length; i += 1) {
		const time = randomTimes[i];
		const nameOfImageToCreate = generateNameOfImageToUpload(videoFileName, i);
		const tmpThumbnailPath = createImageInTmpDirectory(tmpVideoPath, time);

		if (doesFileExist(tmpThumbnailPath)) {
			await uploadFileToS3(tmpThumbnailPath, nameOfImageToCreate);
		}
	}
};

const getVideoDuration = tmpVideoPath => {
	const ffprobe = spawnSync(ffprobePath, [
		"-v",
		"error",
		"-show_entries",
		"format=duration",
		"-of",
		"default=nw=1:nk=1",
		tmpVideoPath
	]);

	return Math.floor(ffprobe.stdout.toString());
};

const generateRandomTimes = (videoDuration, numberOfTimesToGenerate) => {
	const timesInSeconds = [];

	const getRandomNumber = () => {
		return Math.floor(Math.random() * videoDuration);
	};

	for (let x = 0; x < numberOfTimesToGenerate; x += 1) {
		for (let attemptNumber = 0; attemptNumber < 3; attemptNumber += 1) {
			const randomNum = getRandomNumber();
			if (!timesInSeconds.includes(randomNum)) {
				timesInSeconds.push(randomNum);
				break;
			}
		}
	}

	return timesInSeconds;
};

const createImageInTmpDirectory = (tmpVideoPath, targetSecond) => {
	const tmpThumbnailPath = generateThumbnailPath(targetSecond);
	spawnSync(ffmpegPath, [
		"-ss", targetSecond,
		"-i", tmpVideoPath,
		"-vf", "thumbnail,scale=-1:140", // preserve aspect ratio whilst forcing the height to be 140px
		"-vframes", 1,
		tmpThumbnailPath
	]);

	return tmpThumbnailPath;
};

const generateThumbnailPath = targetSecond => {
	const tmpThumbnailPathTemplate = "/tmp/thumbnail-{HASH}-{num}.jpg";
	const uniqueThumbnailPath = generateTmpFilePath(tmpThumbnailPathTemplate);
	const thumbnailPathWithNumber = uniqueThumbnailPath.replace("{num}", targetSecond);

	return thumbnailPathWithNumber;
};

const generateNameOfImageToUpload = (videoFileName, i) => {
	const strippedExtension = videoFileName.replace(".mp4", "");
	return `${strippedExtension}-${i}.jpg`;
};

const uploadFileToS3 = async (tmpThumbnailPath, nameOfImageToCreate) => {
	const contents = fs.createReadStream(tmpThumbnailPath);
	const uploadParams = {
		Bucket: process.env.imageBucketName,
		Key: nameOfImageToCreate,
		Body: contents,
		ContentType: "image/jpg",
		ACL: "public-read"
	};

	const s3 = S3Factory.getSdk();
	await s3.putObject(uploadParams).promise();
};
