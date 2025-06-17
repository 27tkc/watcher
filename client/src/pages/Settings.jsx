import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
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
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/videos/${currentUser._id}`
        );
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

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const makePayment = async () => {
    try {
      const stripe = await stripePromise;

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/stripe/create-checkout-session`,
        { userId: currentUser._id },
        { withCredentials: true }
      );

      const sessionId = res.data.id;

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Stripe Checkout error", err);
    }
  };

  const togglePremium = async () => {
    try {
      if (currentUser?.isPremium) {
        // Deactivate premium
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/premiumdeactivate/${currentUser._id}`,
          {},
          { withCredentials: true }
        );

        // Fetch updated user data
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${currentUser._id}`,
          { withCredentials: true }
        );
        dispatch(loginSuccess(res.data));
      } else {
        // Initiate Stripe payment
        await makePayment();
      }
    } catch (err) {
      console.error("Failed to toggle premium status", err);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentSuccess = query.get("payment") === "success";
    const userId = query.get("userId");

    if (paymentSuccess && userId) {
      (async () => {
        try {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/users/premiumactivate/${userId}`,
            {},
            { withCredentials: true }
          );

          // Fetch updated user data
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
            { withCredentials: true }
          );
          dispatch(loginSuccess(res.data));

          // Clean URL to remove query params without reload
          window.history.replaceState({}, document.title, "/settings");
        } catch (err) {
          // console.error("Premium activation failed", err);
        }
      })();
    }
  }, [dispatch]);

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
