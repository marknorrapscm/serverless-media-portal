import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export default function CommentForm({ videoHash, onCommentAdded }) {
	const [commentText, setCommentText] = useState("");
	const [uploadingComment, setUploadingComment] = useState(false);
	const { addToast } = useToasts();

	useEffect(() => {
		// This is a cheat but it's a quick fix for removing the red validation error 
		// showing on comment field after submitting a comment
		if(!commentText) {
			document.getElementById("comment-form").reset();
		}
	}, [commentText]);

	const onSubmit = async (e) => {
		e.preventDefault();

		setUploadingComment(true);
		const res = await writeCommentToApi();

		if(res.success) {
			setCommentText("");
			onCommentAdded();
			addToast("Comment added", {
				appearance: "success",
				autoDismiss: true
			});
		} else {
			addToast("Error adding comment: " + e.message, {
				appearance: "danger",
				autoDismiss: true
			});
		}

		setUploadingComment(false);
	};

	const writeCommentToApi = async () => {
		const res = await authPost("http://localhost:3001/dev/addCommentToVideo", {
			commentText: commentText,
			videoHash: videoHash
		});

		return res;
	};

	return (
		<Form onSubmit={onSubmit} name="ddsds" method="get" action="/watch" className="mt-2" id="comment-form">
			<InputGroup>
				<Form.Control
					type="text"
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					required
				/>
				<Form.Control
					type="submit"
					value="COMMENT"
					className="btn btn-success"
					style={{ maxWidth: "110px" }}
					disabled={uploadingComment}
				/>
			</InputGroup>
		</Form>
	);
}
