import React, { useState, useEffect } from "react";
import styled from "styled-components";
import getPeriodElapsedSince from "../lib/get-period-elapsed-since";
import useInterval from "../lib/use-interval";

const CommentName = styled.div`
    margin-right: 0.5em;
    font-weight: 600;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const CommentTime = styled.div`
    color: #AAA;
    font-weight: 600;
	white-space: nowrap;
	margin-right: 0.5em;
`;

const DeleteButton = styled.button`
	font-size: 0.75em;
	padding: 0 0.5em;
	font-weight: 700;
	max-height: 19px;
	margin-top: 3px;
`;

export default function Comment({ commentHash, displayName, commentText, dateCreated, canUserDeleteComment, onDeleteCommentClicked }) {
	const [periodSinceCommentWritten, setPeriodSinceCommentWritten] = useState("");
	const [isBeingDeleted, setIsBeingDeleted] = useState(false);

	useEffect(() => {
		updateTimeSinceCommentWritten();
	}, []);

	useInterval(() => {
		updateTimeSinceCommentWritten();
	}, 5000);

	const updateTimeSinceCommentWritten = () => {
		const timeElapsedStr = getPeriodElapsedSince(dateCreated);
		setPeriodSinceCommentWritten(timeElapsedStr);
	};

	return (
		<div className="mt-2" style={{ opacity: isBeingDeleted ? "0.25" : "1" }}>
			<div className="d-flex">
				<CommentName>{displayName}</CommentName>
				<CommentTime>{periodSinceCommentWritten}</CommentTime>

				{!canUserDeleteComment || (
					<DeleteButton
						className="btn btn-secondary"
						onClick={() => {
							if (window.confirm(`Are you sure you want to delete comment: \n\n${commentText.substring(0, 200)}...`)) {
								setIsBeingDeleted(true);
								onDeleteCommentClicked(commentHash);
							}
						}}
					>
						delete
					</DeleteButton>
				)}

			</div>
			<div className="comment-text">{commentText}</div>
		</div>
	);
}
