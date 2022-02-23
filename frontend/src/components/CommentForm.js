import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export default function CommentForm({ videoHash, onCommentAdded }) {
	const [commentText, setCommentText] = useState("");
	const [isCommentButtonEnabled, setIsCommentButtonEnabled] = useState(false);
	const { addToast } = useToasts();

	useEffect(() => {
		// This is a cheat but it's a quick fix for removing the red validation error 
		// showing on text field after submitting a comment
		if(!commentText) {
			document.getElementById("comment-form").reset();
			setIsCommentButtonEnabled(false);
		} else {
			setIsCommentButtonEnabled(true);
		}
	}, [commentText]);

	const onSubmit = async (e) => {
		e.preventDefault();

		setIsCommentButtonEnabled(false);
		const res = await writeCommentToApi();

		if(res.success) {
			setCommentText("");
			onCommentAdded();
			addToast("Comment added", {
				appearance: "success",
				autoDismiss: true
			});
		} else {
			setIsCommentButtonEnabled(true);
			addToast(`Error adding comment: ${e.message}`, {
				appearance: "danger",
				autoDismiss: true
			});
		}
	};

	const writeCommentToApi = async () => {
		const res = await authPost("http://localhost:3001/dev/addCommentToVideo", {
			formData: {
				CommentText: commentText,
				VideoHash: videoHash
			}
		});

		return res;
	};

	return (
		<Form onSubmit={onSubmit} name="" method="get" action="/watch" className="mt-2" id="comment-form">
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
					disabled={!isCommentButtonEnabled}
				/>
			</InputGroup>
		</Form>
	);
}
