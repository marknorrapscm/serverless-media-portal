import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import convertSecondsToMinutes from "../lib/convert-seconds-to-minutes";

export default function VideoThumbnail({ isFiller, videoHash, title, date, thumbnailName, duration }) {
	if (isFiller) {
		return <ThumbnailContainer filler />;
	}

	return (
		<ThumbnailContainer>
			<WrapperLink to={`/watch/${videoHash}`}>
				<ThumbnailImageContainer>
					<img src={`https://${process.env.REACT_APP_imageCloudfrontDomain}/${thumbnailName}`} />
					
					<Timestamp>{convertSecondsToMinutes(duration)}</Timestamp>
				</ThumbnailImageContainer>
				<MetadataContainer>
					<Title title={title}>{title}</Title>
					<Date>{date}</Date>
				</MetadataContainer>
			</WrapperLink>
		</ThumbnailContainer>
	);
}

const ThumbnailContainer = styled.div`
    min-width: 250px;
	width: 15%;
    margin: 0 12px 12px 0;
	flex-grow: 1;
	text-align: center;
    visibility: ${(props) => (props.filler ? "hidden" : "visible")};
	font-family: Roboto, Arial, sans-serif;
	background-color: #FFF;
	border-radius: 5px;
	box-shadow: 1px 2px 4px 0px #e7e7e7;
	
	@media (max-width: 768px) {
		max-width: 100%;
	}
`;

const WrapperLink = styled(Link)`
	color: #000;

    &:hover {
        color: #000;
        text-decoration: none;
    }
`;

const ThumbnailImageContainer = styled.div`
	position: relative;
	background-color: #000;
	width: 100%;
	height: 140px;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;

	img {
		height: 140px;
		max-width: 259px;
	}
`;

const MetadataContainer = styled.div`
	padding: 6px 8px;
	border-radius: 5px;
	overflow-x: hidden;
`;

const Title = styled.div`
	font-weight: bold;
	font-size: 0.9rem;
	text-align: left;
	padding: 0;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
`;

const Date = styled.div`
	color: #999;
	font-size: 0.9rem;
	text-align: left;
	padding: 0;
	line-height: 1;
`;

const Timestamp = styled.div`
	position: absolute;
	right: 6px;
	bottom: 2px;
	font-size: 0.75rem;
	color: #FFF;
`;

