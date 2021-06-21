import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { authFetch } from "../lib/auth-fetch";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { Spinner } from "react-bootstrap";

const CommentContainer = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 0.95em;
`;

const CommentHeader = styled.div`
    font-weight: 600;
`;

const CommentList = styled.div`
    margin-top: 16px;
`;

const SpinnerContainer = styled.div`
	position: absolute;
	width: 100%;
	padding-top: 10px;
	opacity: 0.5;
	text-align: center;
`;

export function CommentPane({ videoHash }) {
	const [isLoading, setIsLoading] = useState(true);
	const [commentList, setCommentList] = useState([]);

	useEffect(() => {
		loadComments();
	}, []);

	const loadComments = async () => {
		setIsLoading(true);
		const res = await authFetch(`http://localhost:3001/dev/getCommentsForVideo?videoHash=${videoHash}`);

		if (res && res.success) {
			setCommentList(res.comments);
		}
		setIsLoading(false);
	};

	const onCommentAdded = async () => {
		await loadComments();
	};

	return (
		<CommentContainer>
			<CommentHeader>{commentList.length} {commentList.length === 1 ? "Comment" : "Comments"}</CommentHeader>
			<CommentForm 
				videoHash={videoHash}
				onCommentAdded={onCommentAdded} 
			/>
			<CommentList>
				{!isLoading || (
					<SpinnerContainer>
						<Spinner animation="border" size="sm" />
					</SpinnerContainer>
				)}
				{commentList.sort(x => x.CreatedOn).reverse().map(c => (
					<Comment
						key={c.CreatedOn}
						displayName={c.UserDisplayName}
						commentText={c.CommentText}
						dateCreated={c.CreatedOn}
					/>
				))}
			</CommentList>
		</CommentContainer>
	);
}
