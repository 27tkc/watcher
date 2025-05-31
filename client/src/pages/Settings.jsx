import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import UserImg from "../img/user.png";

const Container = styled.div`
  padding: 30px;
  background-color: ${({ theme }) => theme.bg};
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
  border: 2px solid ${({ theme }) => theme.soft};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.p`
  font-size: 16px;
`;

const Title = styled.h3`
  font-size: 22px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: fit-content;
  font-weight: 500;
  transition: background-color 0.3s;
  background-color: ${({ $premium }) => ($premium ? "#ff4d4f" : "#4caf50")};
  &:hover {
    background-color: ${({ $premium }) => ($premium ? "#e04344" : "#43a047")};
  }
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const EmptyState = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
`;

const Settings = () => {
  const [videos, setVideos] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/videos/${currentUser._id}`
        );
        console.log(res.data);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos", err);
      }
    };

    fetchVideos();
  }, [currentUser]);

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

  const togglePremium = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${
          currentUser.isPremium ? "premiumdeactivate" : "premiumactivate"
        }/${currentUser._id}`,
        {},
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      console.error("Failed to toggle premium status", err);
    }
  };
  const premiumStatus = currentUser?.isPremium;

  return (
    <Container>
      <Section>
        <Title>Personal Information</Title>
        <UserInfo>
          <Avatar src={currentUser?.img || UserImg} />
          <Info>
            <Label>
              <strong>Name:</strong> {currentUser?.name}
            </Label>
            <Label>
              <strong>Email:</strong> {currentUser?.email}
            </Label>
            <Label>
              <strong>Joined:</strong>{" "}
              {new Date(currentUser?.createdAt).toDateString()}
            </Label>
            <Label>
              <strong>Premium:</strong> {currentUser?.isPremium ? "Yes" : "No"}
            </Label>
            <Button $premium={premiumStatus} onClick={togglePremium}>
              {premiumStatus ? "Deactivate Premium 🥲" : "Buy Premium ✨"}
            </Button>
          </Info>
        </UserInfo>
      </Section>

      <Section>
        <Title>Your Videos</Title>
        {videos.length === 0 ? (
          <EmptyState>No videos uploaded yet.</EmptyState>
        ) : (
          <VideoGrid>
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onDelete={handleDelete}
              />
            ))}
          </VideoGrid>
        )}
      </Section>
    </Container>
  );
};

export default Settings;
