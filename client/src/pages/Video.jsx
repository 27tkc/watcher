import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { timeAgo } from "../utils/TimeAgo";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import UserImg from "../img/user.png";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 6;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bgLighter};
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0px 15px 0px;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  // Helper function to require login for actions
  const requireAuth = () => {
    if (!currentUser) {
      alert("Sign in to like videos, comment, and subscribe.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/videos/find/${path}`
        );
        const channelRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        navigate("/video-not-found");
      }
    };
    fetchData();
  }, [path, dispatch, navigate]);

  const handleLike = async () => {
    if (!requireAuth()) return;
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/users/like/${currentVideo._id}`
    );
    dispatch(like(currentUser._id));
  };
  const handleDislike = async () => {
    if (!requireAuth()) return;
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/users/dislike/${currentVideo._id}`
    );
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    if (!requireAuth()) return;
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/unsub/${channel._id}`
        )
      : await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/sub/${channel._id}`
        );
    dispatch(subscription(channel._id));
  };

  // For Share and Save buttons, just alert if not signed in, no further logic for now
  const handleShareOrSave = () => {
    if (!requireAuth()) return;
    alert("Feature coming soon!"); // Placeholder for share/save logic
  };

  return (
    <Container>
      {currentVideo ? (
        <>
          <Content>
            <VideoWrapper>
              <VideoFrame src={currentVideo.videoUrl} controls autoPlay />
            </VideoWrapper>
            <Title>{currentVideo.title}</Title>
            <Details>
              <Info>
                {currentVideo.views} views • {timeAgo(currentVideo.createdAt)}
              </Info>
              <Buttons>
                <Button onClick={handleLike}>
                  {currentVideo.likes?.includes(currentUser?._id) ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}{" "}
                  {currentVideo.likes?.length}
                </Button>
                <Button onClick={handleDislike}>
                  {currentVideo.dislikes?.includes(currentUser?._id) ? (
                    <ThumbDownIcon />
                  ) : (
                    <ThumbDownOffAltOutlinedIcon />
                  )}
                </Button>
                <Button onClick={handleShareOrSave}>
                  <ReplyOutlinedIcon /> Share
                </Button>
                <Button onClick={handleShareOrSave}>
                  <AddTaskOutlinedIcon /> Save
                </Button>
              </Buttons>
            </Details>
            <Channel>
              <ChannelInfo>
                <Image src={channel.img ? channel.img : UserImg} />
                <ChannelDetail>
                  <ChannelName>{channel.name}</ChannelName>
                  <ChannelCounter>
                    {channel.subscribers} subscribers
                  </ChannelCounter>
                  <Description>{currentVideo.desc}</Description>
                </ChannelDetail>
              </ChannelInfo>
              <Subscribe onClick={handleSub}>
                {currentUser?.subscribedUsers?.includes(channel._id)
                  ? "SUBSCRIBED"
                  : "SUBSCRIBE"}
              </Subscribe>
            </Channel>
            <Comments videoId={currentVideo?._id} currentUser={currentUser} />
          </Content>
          <Recommendation tags={currentVideo?.tags} />
        </>
      ) : (
        <p style={{ color: "white" }}>Loading video...</p>
      )}
    </Container>
  );
};

export default Video;
