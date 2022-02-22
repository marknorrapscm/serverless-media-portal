import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components/macro";
import SpinnerCentered from "../components/SpinnerCentered";
import { VideoPlayer } from "../components/VideoPlayer";
import { authGet } from "../lib/auth-fetch";
import getDateString from "../lib/get-date-string";
import { RelatedVideosPane } from "../components/RelatedVideosPane";
import { CommentPane } from "../components/CommentPane";
import EditVideoButtons from "../components/EditVideoButtons";
import VideoContext from "../components/VideoContext";
import isUserAdmin from "../lib/is-user-admin";

const VideoMetadataContainer = styled.div`
	background-color: #FFF;
	border: 1px solid #ececec;
	padding: 0.5em 1em 1em;
	margin-top: -6px;
	box-shadow: 1px 2px 4px 0px #e7e7e7;
`;

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
	padding-right: 2em;
`;

export default function Watch() {
	const [video, setVideo] = useState({});
	const { videoHash } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [isUserAnAdmin, setIsUserAnAdmin] = useState(false);

	useEffect(() => {
		checkUserPrivledgeLevel();
	}, []);

	useEffect(() => {
		setIsLoading(true);
		getVideo();
	}, [videoHash]);

	const checkUserPrivledgeLevel = async () => {
		setIsUserAnAdmin(await isUserAdmin());
	};

	const getVideo = async () => {
		if(videoHash) {
			const res = await authGet(`http://localhost:3001/dev/getVideo?videoHash=${videoHash}`);
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
					<Row className="pt-4 px-2">
						<Col lg={9} xs={12}>
							<VideoPlayer />

							<VideoMetadataContainer>
								<div className="d-flex">
									<VideoTitle>{video.Title}</VideoTitle>
									<ViewCounterContainer>
										<ViewCounter>
											{`${video.ViewCount || 0} `}
											{video.ViewCount == 1 ? "view" : "views"}
										</ViewCounter>
									</ViewCounterContainer>
								</div>

								<VideoDate>{getDateString(video.VideoDate)}</VideoDate>

								<div className="d-flex justify-content-between align-items-end">
									<VideoDescription>{video.Description}</VideoDescription>
									<EditVideoButtons isUserAnAdmin={isUserAnAdmin} />
								</div>
							</VideoMetadataContainer>

							<CommentPane 
								videoHash={videoHash} 
								isUserAnAdmin={isUserAnAdmin}
							/>
						</Col>
						<Col lg={3} xs={12} className="pl-1">
							<RelatedVideosPane />
						</Col>
					</Row>
				</VideoContext.Provider>
			)}
		</>
	);
}
