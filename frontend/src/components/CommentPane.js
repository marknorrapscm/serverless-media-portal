import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { authGet } from "../lib/auth-fetch";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { Spinner } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { getSavedHashFromLocalStorage } from "../lib/local-storage";

const CommentContainer = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 0.95em;
	padding: 1em;
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

export function CommentPane({ videoHash, isUserAnAdmin }) {
	const [isLoading, setIsLoading] = useState(true);
	const [commentList, setCommentList] = useState([]);
	const { addToast } = useToasts();
	
	const userHash = getSavedHashFromLocalStorage();

	useEffect(() => { 
		loadComments();
	}, []);

	const loadComments = async () => {
		setIsLoading(true);
		const res = await authGet(`http://localhost:3001/dev/getCommentsForVideo?videoHash=${videoHash}`);

		if (res && res.success && res.comments) {
			setCommentList(res.comments);
		}
		setIsLoading(false);
	};

	const onCommentAdded = async () => {
		await loadComments();
	};

	const deleteComment = async (commentHash) => {
		const res = await authGet(
			`http://localhost:3001/dev/deleteCommentFromVideo?videoHash=${videoHash}&commentHash=${commentHash}`
		);

		if(res.success) {
			addToast("Comment deleted", {
				appearance: "success",
				autoDismiss: true
			});
		} else {
			setCommentList([]); // Force refresh of comments to remove opacity
			addToast("Error deleting comment", {
				appearance: "error",
				autoDismiss: true
			});
			console.error(res.message);
		}

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
						key={c.CommentHash}
						commentHash={c.CommentHash}
						displayName={c.UserDisplayName}
						commentText={c.CommentText}
						dateCreated={c.CreatedOn}
						onDeleteCommentClicked={deleteComment}
						canUserDeleteComment={c.UserHash === userHash || isUserAnAdmin}
					/>
				))}
			</CommentList>
		</CommentContainer>
	);
}
