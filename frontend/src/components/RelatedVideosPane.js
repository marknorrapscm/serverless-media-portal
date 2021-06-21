import React, { useState, useEffect } from "react";
import { authFetch } from "../lib/auth-fetch";
import { Spinner } from "react-bootstrap";
import RelatedVideoThumbnail from "./RelatedVideoThumbnail";

export function RelatedVideosPane() {
	const [isLoading, setIsLoading] = useState(true);
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		getVideos();
	}, []);

	const getVideos = async () => {
		const res = await authFetch("http://localhost:3001/dev/listRandomVideos?count=5");

		if (res && res.videos) {
			setVideos(res.videos);
		}
		setIsLoading(false);
	};

	return (
		<>
			<style>{`
				.related-videos-title {
					margin-bottom: 14px;
					color: #8c8fa4;
				}
			`}</style>

			<h5 className="related-videos-title">Related videos</h5>

			{isLoading ? (
				<div className="text-center mt-5">
					<Spinner animation="grow" />
				</div>
			) : (
				videos.map(video => (
					<RelatedVideoThumbnail key={video.VideoHash}
						videoHash={video.VideoHash}
						title={video.Title}
						date={video.VideoDate}
						thumbnailName={video.ThumbnailName}
						duration={video.Duration}
					/>
				))
			)}
		</>
	);
}
