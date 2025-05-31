import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoCard from "../components/VideoCard"; // Reuse or create for CRUD view
import UserImg from "../img/user.png";

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.p`
  margin: 5px 0;
  font-size: 15px;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
`;

const Settings = () => {
  const [videos, setVideos] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/videos/${videoId}`
      );
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
    } catch (err) {
      console.error("Error deleting video", err);
    }
  };

  return (
    <Container>
      <Title>Personal Information</Title>
      <UserInfo>
        <Avatar src={currentUser?.img || { UserImg }} />
        <Info>
          <Label>
            <strong>Name: </strong>
            {currentUser?.name}
          </Label>
          <Label>
            <strong>Email: </strong> {currentUser?.email}
          </Label>
          <Label>
            <strong>Joined: </strong>
            {new Date(currentUser?.createdAt).toDateString()}
          </Label>
          <Label>
            <strong>Premium: </strong>
            {currentUser?.isPremium}
          </Label>
        </Info>
      </UserInfo>

      <Title>Your Videos</Title>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <VideoGrid>
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} onDelete={handleDelete} />
          ))}
        </VideoGrid>
      )}
    </Container>
  );
};

export default Settings;
