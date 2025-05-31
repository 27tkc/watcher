import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Card from "../components/Card";
import Spinner from "../components/Spinner"; // ⬅️ Import Spinner

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Loading state

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/videos/${type || ""}`
        );
        if (Array.isArray(res.data)) {
          setVideos(res.data);
          setError(null);
        } else {
          console.warn("⚠️ Unexpected response:", res.data);
          setError("No videos available.");
        }
      } catch (err) {
        console.error("❌ Error fetching videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchVideos();
  }, [type]);

  if (loading)
    return (
      <Spinner
        text={"Loading data from free server, please wait 1 min..."}
      ></Spinner>
    );

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
