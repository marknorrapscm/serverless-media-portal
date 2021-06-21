import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const ThumbnailImage = styled.img`
	border: 2px solid #FFF;
	margin: 5px;
	opacity: 0.85;

	&.selected-thumbnail {
		border-color: #FFF;
		box-shadow: 1px 1px 5px 0px #263e51;
		opacity: 1;
	}

	&:hover {
		cursor: pointer;
	}
`;

const ThumbnailLoadingPlaceholder = styled.div`
	width: 84px;
	font-size: 0.8em;
	text-align: center;
	font-weight: bold;
	height: 140px;
	background-color: #dfdfdf;
	padding-top: 20px;
	display: inline-block;
`;

/**
 * This component should be a target for refactoring; it's not the cleanest approach.
 * 
 * This component works by taking a video name and attempting to fetch the 3 thumbnails 
 * that it expects to be generated. It generates the URL of the thumbnail based on the 
 * video name then makes a total of 12 attempts to fetch the file, with a 5 second delay 
 * between each attempt. This assumes that at least one thumbnail will be generated 
 * within a minute it being called (i.e. after the video upload has completed).
 */
export function ThumbnailSelector({ videoName, onThumbnailSelected }) {
	const [thumbnailImageNames, setThumbnailImageNames] = useState([]);
	const thumbnailImageNamesThatExist = useRef([]);
	const [forceRender, setForceRender] = useState(true);
	const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState();
	const [haveAllImagesBeenLoaded, setHaveAllImagesBeenLoaded] = useState(false);

	const numberOfThumbnailsToFetch = 3;

	useEffect(() => {
		buildThumbnailUrlList();
	}, []);

	useEffect(() => {
		loadImages();
	}, [thumbnailImageNames]);

	useEffect(() => {
		setForceRender(!forceRender);
		selectedThumbnail(thumbnailImageNamesThatExist.current[0]);

		if (thumbnailImageNamesThatExist.current.length === numberOfThumbnailsToFetch) {
			setHaveAllImagesBeenLoaded(true);
		}
	}, [thumbnailImageNamesThatExist.current]);

	const buildThumbnailUrlList = async () => {
		const thumbnailImages = [];
		const videoNameWithoutExtension = videoName.replace(".mp4", "");

		for (let x = 0; x < numberOfThumbnailsToFetch; x += 1) {
			thumbnailImages.push(`${videoNameWithoutExtension}-${x}.jpg`);
		}

		setThumbnailImageNames(thumbnailImages);
	};

	const loadImages = async () => {
		for (let x = 0; x < thumbnailImageNames.length; x++) {
			await attemptImageLoad(`${thumbnailImageNames[x]}`, 1);
		}
	};

	const attemptImageLoad = async (imageNameWithExtension, attemptNumber) => {
		try {
			const res = await fetch(`https://${process.env.REACT_APP_imageCloudfrontDomain}/${imageNameWithExtension}`, { method: "HEAD" });

			if (res.ok) {
				const newArr = JSON.parse(JSON.stringify(thumbnailImageNamesThatExist.current));
				newArr.push(imageNameWithExtension);
				thumbnailImageNamesThatExist.current = newArr;
				setForceRender(!forceRender);
			} else {
				throw "Didn't find image";
			}
		} catch (e) {
			if (attemptNumber <= 12) {
				setTimeout(() => {
					attemptImageLoad(imageNameWithExtension, attemptNumber + 1);
				}, 4000);
			} else {
				console.log("All 12 attempts have failed for: " + imageNameWithExtension);
				setHaveAllImagesBeenLoaded(true);
			}
		}
	};

	const selectedThumbnail = url => {
		setSelectedThumbnailUrl(url);
		onThumbnailSelected(url);
	};

	return (
		<div>
			{thumbnailImageNamesThatExist.current.map(name => (
				<ThumbnailImage
					src={`https://${process.env.REACT_APP_imageCloudfrontDomain}/${name}`}
					key={name}
					className={selectedThumbnailUrl === name ? "selected-thumbnail" : ""}
					onClick={() => selectedThumbnail(name)}
				/>
			))}

			{haveAllImagesBeenLoaded || (
				<ThumbnailLoadingPlaceholder>
					<Spinner animation="grow" size="sm" />
					<div>Fetching thumbnails</div>
				</ThumbnailLoadingPlaceholder>
			)}
		</div>
	);
}
