import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/videos/${type || ""}`
        );
        // console.log("📦 API response:", res.data);
        if (Array.isArray(res.data)) {
          setVideos(res.data);
        } else {
          console.warn("⚠️ Unexpected response:", res.data);
          setError("No videos available.");
        }
      } catch (err) {
        console.error("❌ Error fetching videos:", err);
        setError("Failed to load videos.");
      }
    };

    fetchVideos();
  }, [type]);

  return (
    <Container>
      {error ? (
        <p>{error}</p>
      ) : (
        videos.map((video) => <Card key={video._id} video={video} />)
      )}
    </Container>
  );
};

export default Home;
