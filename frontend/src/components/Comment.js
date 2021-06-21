import React, { useState, useEffect } from "react";
import styled from "styled-components";
import getPeriodElapsedSince from "../lib/get-period-elapsed-since";
import useInterval from "../lib/use-interval";

const CommentName = styled.div`
    margin-right: 6px;
    font-weight: 600;
`;

const CommentTime = styled.div`
    color: #AAA;
    font-weight: 600;
`;

export default function Comment({ displayName, commentText, dateCreated }) {
	const [periodSinceCommentWritten, setPeriodSinceCommentWritten] = useState("");

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
		<div className="mt-2">
			<div className="d-flex">
				<CommentName>{displayName}</CommentName>
				<CommentTime>{periodSinceCommentWritten}</CommentTime>
			</div>
			<div className="comment-text">{commentText}</div>
		</div>
	);
}
