import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background-color: #999;
`;

const Img = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 10px;
`;

const Title = styled.h4`
  margin: 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Btn = styled.button`
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
`;

const VideoCard = ({ video, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <Img src={video.imgUrl} />
      <Info>
        <Title>{video.title}</Title>
        <Buttons>
          <Btn onClick={() => navigate(`/edit-video/${video._id}`)}>Edit</Btn>
          <Btn onClick={() => onDelete(video._id)}>Delete</Btn>
        </Buttons>
      </Info>
    </Card>
  );
};

export default VideoCard;
