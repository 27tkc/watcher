import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Watcher from "../img/logo.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  text-align: center;
  padding: 20px;
  margin-top: 100px;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.textSoft};
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
    color: ${({ theme }) => theme.bgLighter};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  height: 200px;
`;

const VideoNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo>
        <Img src={Watcher} />
      </Logo>
      <Title>Video Not Found ❌</Title>
      <Subtitle>
        Oops! The video you’re looking for doesn’t exist or has been removed.
      </Subtitle>
      <Button onClick={() => navigate("/")}>Go back to Home</Button>
    </Container>
  );
};

export default VideoNotFound;
