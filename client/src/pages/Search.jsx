import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import VideoNotFound from "../pages/VideoNotFound";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/videos/search${query}`
        );
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      }
      setLoading(false);
    };
    fetchVideos();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  // ⬇️ Show not-found outside the Container
  if (videos.length === 0) return <VideoNotFound />;

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Search;
