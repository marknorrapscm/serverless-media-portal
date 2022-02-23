/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const fs = require("fs");
const { spawnSync } = require("child_process");
const doesFileExist = require("./does-file-exist");
const generateTmpFilePath = require("./generate-tmp-file-path");
const S3 = require("../../../persistence/storage/S3");

const ffprobePath = "/opt/bin/ffprobe";
const ffmpegPath = "/opt/bin/ffmpeg";

module.exports = async (tmpVideoPath, numberOfThumbnails, videoFileName) => {
	const randomTimes = generateRandomTimes(tmpVideoPath, numberOfThumbnails);

	for (const [index, randomTime] of Object.entries(randomTimes)) {
		const tmpThumbnailPath = await createImageFromVideo(tmpVideoPath, randomTime);

		if (doesFileExist(tmpThumbnailPath)) {
			const nameOfImageToCreate = generateNameOfImageToUpload(videoFileName, index);
			await uploadFileToS3(tmpThumbnailPath, nameOfImageToCreate);
		}
	}
};

const generateRandomTimes = (tmpVideoPath, numberOfTimesToGenerate) => {
	const timesInSeconds = [];
	const videoDuration = getVideoDuration(tmpVideoPath);

	for (let x = 0; x < numberOfTimesToGenerate; x += 1) {
		const randomNum = getRandomNumberNotInExistingList(timesInSeconds, videoDuration);

		if (randomNum >= 0) {
			timesInSeconds.push(randomNum);
		}
	}

	return timesInSeconds;
};

const getRandomNumberNotInExistingList = (existingList, maxValueOfNumber) => {
	for (let attemptNumber = 0; attemptNumber < 3; attemptNumber += 1) {
		const randomNum = getRandomNumber(maxValueOfNumber);

		if (!existingList.includes(randomNum)) {
			return randomNum;
		}
	}

	return -1;
};

const getRandomNumber = upperLimit => {
	return Math.floor(Math.random() * upperLimit);
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

const createImageFromVideo = (tmpVideoPath, targetSecond) => {
	const tmpThumbnailPath = generateThumbnailPath(targetSecond);
	const ffmpegParams = createFfmpegParams(tmpVideoPath, tmpThumbnailPath, targetSecond);
	spawnSync(ffmpegPath, ffmpegParams);

	return tmpThumbnailPath;
};

const generateThumbnailPath = targetSecond => {
	const tmpThumbnailPathTemplate = "/tmp/thumbnail-{HASH}-{num}.jpg";
	const uniqueThumbnailPath = generateTmpFilePath(tmpThumbnailPathTemplate);
	const thumbnailPathWithNumber = uniqueThumbnailPath.replace("{num}", targetSecond);

	return thumbnailPathWithNumber;
};

const createFfmpegParams = (tmpVideoPath, tmpThumbnailPath, targetSecond) => {
	return [
		"-ss", targetSecond,
		"-i", tmpVideoPath,
		"-vf", "thumbnail,scale=-1:140", // preserve aspect ratio whilst forcing the height to be 140px
		"-vframes", 1,
		tmpThumbnailPath
	];
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

	const s3 = new S3().GetSdk();
	await s3.putObject(uploadParams).promise();
};
