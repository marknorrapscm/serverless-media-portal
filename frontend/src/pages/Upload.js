import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ThumbnailSelector } from "../components/ThumbnailSelector";
import { authFetch, authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export default function Upload() {
	const [tags, setTags] = useState([]);
	const [videoDuration, setVideoDuration] = useState(0);
	const [isStatusMessageVisible, setIsStatusMessageVisible] = useState(false);
	const [statusMessage, setStatusMessage] = useState();

	const [videoUploadInProgress, setVideoUploadInProgress] = useState(false);
	const [videoHasBeenUploaded, setVideoHasBeenUploaded] = useState(false);
	const [selectedVideoName, setSelectedVideoName] = useState();
	const [selectedThumbnailName, setSelectedThumbnailName] = useState();
	const { addToast } = useToasts();

	useEffect(() => {
		loadTags();
	}, []);

	const loadTags = async () => {
		const res = await authFetch("http://localhost:3001/dev/getAllTags");

		if (res && res.tags) {
			setTags(res.tags);
		}
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (videoUploadInProgress || !videoHasBeenUploaded) { return; }

		const formData = getFormData(e.target);
		setIsStatusMessageVisible(true);
		setStatusMessage("Uploading form");

		const formUploadResult = await performFormUpload(formData);
		if (formUploadResult.success) {
			setStatusMessage("Form and video submission complete");
			addNotification("Form submission complete", "success");
		}
	};

	const getFormData = form => {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		return data;
	};

	const performFormUpload = async formData => {
		const data = {
			videoFileName: selectedVideoName,
			videoDate: formData.date,
			title: formData.title,
			description: formData.description,
			duration: formData.duration,
			thumbnailName: selectedThumbnailName,
			tags: getSelectedTags(formData)
		};

		const res = await authPost("http://localhost:3001/dev/submitForm", {
			formData: data
		});

		return res;
	};

	const getSelectedTags = formData => {
		const tagNames = tags.map(x => x.TagName);
		const selectedTags = Object.keys(formData).filter(key => tagNames.includes(key));

		return selectedTags;
	};


	const onVideoSelection = async e => {
		setIsStatusMessageVisible(true);
		setVideoUploadInProgress(true);
		const videoFile = e.target.files[0];

		if (isFileValid(videoFile)) {
			getAndSetVideoDuration(videoFile);
			await uploadFile(videoFile);
		}
	};

	const isFileValid = file => {
		const fileSizeInMB = Math.floor(file.size / 1024 / 1024);
		if (fileSizeInMB > 512) {
			setStatusMessage("File exceeds 512MB limit");
		} else if (!file.name.includes(".mp4")) {
			setStatusMessage("Selected file is not an MP4");
		} else {
			return true;
		}
	};

	const uploadFile = async videoFile => {
		setStatusMessage("Getting presigned URL");
		const uploadTarget = await getPresignedUrl(videoFile.name);

		if (uploadTarget) {
			setStatusMessage("Performing file upload");
			if (await sendFileToPresignedUrl(uploadTarget.uploadUrl, videoFile)) {
				setStatusMessage("Video uploaded");
				setSelectedVideoName(videoFile.name);
				setVideoUploadInProgress(false);
				setVideoHasBeenUploaded(true);
				addNotification("Video uploaded", "success");
			}
		}

		setVideoUploadInProgress(false);
	};

	const getPresignedUrl = async fileName => {
		const res = await authFetch(`http://localhost:3001/dev/getPresignedUrlForVideoUpload?fileName=${fileName}`);

		if (res && res.uploadTarget) {
			return res.uploadTarget;
		} else {
			setStatusMessage("Error in getPresignedUrl()");
			console.error(res);
			return false;
		}
	};

	const sendFileToPresignedUrl = async (presignedUrl, file) => {
		const res = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": "video/mp4"
			}
		});

		if (res.status === 200) {
			return true;
		} else {
			setStatusMessage("Error in performFileUpload()");
			console.error(res);
			return false;
		}
	};

	const getAndSetVideoDuration = videoFile => {
		const video = document.createElement("video");
		video.preload = "metadata";

		video.onloadedmetadata = function () {
			window.URL.revokeObjectURL(video.src);
			const duration = Math.floor(video.duration);
			setVideoDuration(duration);
		};

		video.src = URL.createObjectURL(videoFile);
	};

	const clearForm = () => {
		setVideoDuration(0);
		setIsStatusMessageVisible(false);
		setStatusMessage();
		setVideoUploadInProgress(false);
		setVideoHasBeenUploaded(false);
		setSelectedVideoName();
		setSelectedThumbnailName();
		document.getElementById("upload-form").reset();
	};

	const addNotification = (msg, type) => {
		addToast(msg, {
			appearance: type,
			autoDismiss: true
		});
	};

	return (
		<Row style={{ padding: "1.75em" }}>
			<Col lg={6} md={10} sm={12}>
				<div className="d-flex">
					<h4>Upload a new video</h4>
					<Button
						variant="secondary"
						size="sm"
						className="ml-auto"
						onClick={() => clearForm()}
					>
						Clear Form
					</Button>
				</div>

				<hr />

				<Form onSubmit={onSubmit} id="upload-form">
					<Form.Row>
						<Form.Label column="lg" lg={2}>Video Title:</Form.Label>
						<Col>
							<Form.Control name="title" size="lg" type="text" minLength="1" required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column lg={2}>Taken on:</Form.Label>
						<Col>
							<Form.Control name="date" type="date" required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column lg={2}>Duration:</Form.Label>
						<Col>
							<Form.Control
								name="duration"
								type="text"
								value={videoDuration}
								readOnly
								required
							/>
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column lg={2}>Description:</Form.Label>
						<Col>
							<Form.Control
								name="description"
								as="textarea"
								placeholder="Description is optional"
								rows={3}
							/>
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column lg={2} className="text-nowrap">Select {videoHasBeenUploaded ? "thumbnail" : "video"}:</Form.Label>
						<Col>
							{videoUploadInProgress ? (
								<Spinner animation="grow" size="sm" />
							) : videoHasBeenUploaded ? (
								<ThumbnailSelector
									videoName={selectedVideoName}
									onThumbnailSelected={setSelectedThumbnailName}
								/>
							) : (
								<Form.Control
									name="file"
									id="file-input"
									type="file"
									placeholder="Normal text"
									style={{ paddingTop: "0.5em" }}
									accept=".mp4"
									onChange={async e => await onVideoSelection(e)}
									required
								/>
							)}
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column lg={2}>Select tags:</Form.Label>
						<Col style={{ paddingTop: "10px" }}>
							{tags.length === 0 ? (
								<Spinner animation="grow" size="sm" />
							) : (
								tags.map(tag => (
									<Form.Check
										key={tag.TagName}
										custom
										inline
										label={tag.TagName}
										type="checkbox"
										name={tag.TagName}
										id={tag.TagName}
										value={true}
									/>
								))
							)}
						</Col>
					</Form.Row>

					<hr />

					<Form.Row style={{ flexWrap: "nowrap" }}>
						<Button variant="success" type="submit" className="w-25" disabled={!videoHasBeenUploaded}>
							{videoUploadInProgress ? (
								<Spinner animation="border" size="sm" />
							) : (
								<>Submit</>
							)}
						</Button>

						{!isStatusMessageVisible || (
							<Button variant="secondary" className="w-75 ml-2">
								{statusMessage}
							</Button>
						)}
					</Form.Row>
				</Form>
			</Col>
		</Row>
	);
}