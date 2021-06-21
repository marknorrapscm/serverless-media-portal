import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import convertSecondsToMinutes from "../lib/convert-seconds-to-minutes";

export default function RelatedVideoThumbnail({ videoHash, title, date, thumbnailName, duration }) {
	return (
		<ThumbnailContainer>
			<WrapperLink to={`/watch/${videoHash}`}>
				<ThumbnailImageContainer>
					<img src={`https://${process.env.REACT_APP_imageCloudfrontDomain}/${thumbnailName}`} />
					<Timestamp>{convertSecondsToMinutes(duration)}</Timestamp>
				</ThumbnailImageContainer>
				<MetadataContainer>
					<Title>{title}</Title>
					<Date>{date}</Date>
				</MetadataContainer>
			</WrapperLink>
		</ThumbnailContainer>
	);
}

const ThumbnailContainer = styled.div`
	width: 100%;
    margin: 0 12px 12px 0;
	flex-grow: 1;
	text-align: center;
	font-family: Roboto, Arial, sans-serif;
	background-color: #FFF;
	border-radius: 5px;
	box-shadow: 1px 2px 4px 0px #e7e7e7;
	
	@media (max-width: 768px) {
		max-width: 100%;
	}
`;

const WrapperLink = styled(Link)`
    display: flex;
    color: #000;

    &:hover {
        color: #000;
        text-decoration: none;
    }
`;

const ThumbnailImageContainer = styled.div`
	position: relative;
    background-color: #000;
    width: 43%;
	height: 105px;
	border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    
    img {
        height: 100%;
    }
`;

const Title = styled.div`
	font-weight: bold;
	font-size: 0.9rem;
	text-align: left;
	padding: 4px 6px 0px;
`;

const Date = styled.div`
	color: #999;
	font-size: 0.9rem;
	text-align: left;
	padding: 0px 6px 0px;
	line-height: 1;
`;

const Timestamp = styled.div`
	position: absolute;
	right: 6px;
	bottom: 2px;
	font-size: 0.75rem;
	color: #FFF;
`;

const MetadataContainer = styled.div`
    width: 57%;
	padding: 2px 2px 6px 2px;
	border-radius: 5px;
`;