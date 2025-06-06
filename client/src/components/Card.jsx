import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { timeAgo } from "../utils/TimeAgo";
import UserImg from "../img/user.png";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "320px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "20px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 5px;
`;

const Image = styled.img`
  width: ${(props) => (props.type === "sm" ? "180px" : "310px")};
  height: ${(props) => (props.type === "sm" ? "100px" : "200px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "5px"};
  gap: 5px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 10px;
  color: ${({ theme }) => theme.textSoft};
  margin: 2px 0px;
`;

const Info = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/find/${video.userId}`
      );
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image type={type} src={video.imgUrl} />
        <Details type={type}>
          <ChannelImage type={type} src={channel.img ? channel.img : UserImg} />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>
              {video.views} views • {timeAgo(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
