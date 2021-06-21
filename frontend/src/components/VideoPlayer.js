import React, { useState, useContext } from "react";
import { authFetch } from "../lib/auth-fetch";
import VideoContext from "./VideoContext";
import styles from "./VideoPlayer.module.css";

export function VideoPlayer() {
	const { video } = useContext(VideoContext);
	const [hasViewCountBeenUpdated, setHasViewCountBeenUpdated] = useState(false);

	const addViewCountToVideo = async () => {
		if(!hasViewCountBeenUpdated) {
			await authFetch(`http://localhost:3001/dev/addViewToVideo?videoHash=${video.VideoHash}`);
			setHasViewCountBeenUpdated(true);
		}
	};

	return (
		<video 
			controls 
			className={styles["video-player"]} 
			onPlay={addViewCountToVideo}
		>
			<source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video.VideoFileName}`} type="video/mp4" />
			Sorry, your browser does not support embedded videos.
		</video>
	);
}
