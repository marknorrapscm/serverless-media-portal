import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components/macro";
import SpinnerCentered from "../components/SpinnerCentered";
import { VideoPlayer } from "../components/VideoPlayer";
import { authFetch } from "../lib/auth-fetch";
import getDateString from "../lib/get-date-string";
import { RelatedVideosPane } from "../components/RelatedVideosPane";
import { CommentPane } from "../components/CommentPane";
import EditVideoButtons from "../components/EditVideoButtons";
import VideoContext from "../components/VideoContext";

const VideoTitle = styled.div`
	font-weight: 600;
	font-size: 1.3em;
	line-height: 1.6;
	margin-top: 4px;
`;

const ViewCounterContainer = styled.div`
	display: flex;
	margin-left: auto;
	margin-top: 4px;
`;

const ViewCounter = styled.div`
	font-weight: 600;
	font-size: 1.3em;
	line-height: 1.6;
	color: #8c8fa4;
	font-size: 1.1em;
`;

const VideoDate = styled.div`
	font-weight: 600;
	font-size: 1em;
	color: #8c8fa4;
`;

const VideoDescription = styled.div`
	font-size: 0.95em;
	margin-top: 16px;
	letter-spacing: -0.02em;
`;

export default function Watch() {
	const [video, setVideo] = useState({});
	const { videoHash } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		getVideo();
	}, [videoHash]);

	const getVideo = async () => {
		if(videoHash) {
			const res = await authFetch(`http://localhost:3001/dev/getVideo?videoHash=${videoHash}`);
			if (res.success) {
				setIsLoading(false);
				setVideo(res.video);
			}
		}
	};

	return (
		<>
			{isLoading ? (
				<SpinnerCentered />
			) : (
				<VideoContext.Provider value={{ video, setVideo }}>
					<Row style={{ padding: "1.75em" }}>
						<Col lg={9} xs={12}>
							<VideoPlayer />

							<div className="d-flex">
								<VideoTitle>{video.Title}</VideoTitle>
								<ViewCounterContainer>
									<EditVideoButtons />
									<ViewCounter>
										{`${video.ViewCount || 0} `}
										{video.ViewCount == 1 ? "view" : "views"}
									</ViewCounter>
								</ViewCounterContainer>
							</div>

							<VideoDate>{getDateString(video.VideoDate)}</VideoDate>
							<VideoDescription>{video.Description}</VideoDescription>
							<hr />
							<CommentPane videoHash={videoHash} />
							<hr />
						</Col>
						<Col lg={3} xs={12}>
							<RelatedVideosPane />
						</Col>
					</Row>
				</VideoContext.Provider>
			)}
		</>
	);
}
