import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SpinnerCentered from "../components/SpinnerCentered";
import VideoThumbnail from "../components/VideoThumbnail";
import { authFetch } from "../lib/auth-fetch";

const ThumbnailContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding: 20px 12px 20px 18px;
`;

export default function Browse() {
	const [isLoading, setIsLoading] = useState(true);
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		loadVideos();
	}, []);

	const loadVideos = async () => {
		const res = await authFetch("http://localhost:3001/dev/listVideos");

		if(res && res.videos) {
			setVideos(res.videos);
		}
		
		setIsLoading(false);
	};

	const sortFn = (a, b) => {
		if(a.VideoDate < b.VideoDate) { 
			return 1; 
		} else { 
			return -1; 
		}
	};

	return (
		<>
			{isLoading ? (
				<SpinnerCentered />
			) : (
				<ThumbnailContainer>
					{videos.sort(sortFn).map((video) => (
						<VideoThumbnail key={video.VideoHash}
							isFiller={false}
							videoHash={video.VideoHash}
							title={video.Title}
							date={video.VideoDate}
							thumbnailName={video.ThumbnailName}
							duration={video.Duration}
						/>
					))}
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
				</ThumbnailContainer>
			)}
		</>
	);
}

