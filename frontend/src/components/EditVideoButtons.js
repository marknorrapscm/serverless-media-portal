import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { authFetch, authPost } from "../lib/auth-fetch";
import isUserAdmin from "../lib/is-user-admin";
import VideoContext from "./VideoContext";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";
import EditVideoModal from "./EditVideoModal";

export default function EditVideoButtons() {
	const [displayEditButtons, setDisplayEditButtons] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { video, setVideo } = useContext(VideoContext);
	const { addToast } = useToasts();
	const history = useHistory();

	useEffect(() => {
		checkUsersPrivledge();
	}, []);

	const checkUsersPrivledge = async () => {
		if (await isUserAdmin()) {
			setDisplayEditButtons(true);
		}
	};

	const onDeleteClicked = async () => {
		const res = await authFetch(`http://localhost:3001/dev/deleteVideo?videoHash=${video.VideoHash}`);

		if (res && res.success) {
			addNotification("Video deleted", "success");
			history.push("/");
		} else {
			addNotification("Error deleting video", "error");
		}
	};

	const onEditFormSubmitted = async (newVideo) => {
		const res = await authPost("http://localhost:3001/dev/editVideo", {
			video: newVideo
		});

		if (res.success) {
			setVideo(newVideo);
			addNotification("Video successfully updated", "success");
		} else {
			addNotification("Error updating video", "error");
			console.error(res.message);
		}
	};

	const addNotification = (msg, type) => {
		addToast(msg, {
			appearance: type,
			autoDismiss: true
		});
	};

	return (
		!displayEditButtons || (
			<>
				<div>
					<Button
						variant="warning"
						size="sm"
						className="mr-1"
						onClick={() => setIsEditModalOpen(true)}
					>
						Edit
					</Button>

					<Button
						variant="danger"
						size="sm"
						className="mr-2"
						onClick={() => {
							if (window.confirm("Are you sure you want to delete this video?")) {
								onDeleteClicked();
							}
						}}
					>
						Delete
					</Button>
				</div>

				<EditVideoModal
					video={video}
					isOpen={isEditModalOpen}
					setIsOpen={setIsEditModalOpen}
					onEditFormSubmitted={onEditFormSubmitted}
				/>
			</>
		)
	);
}

