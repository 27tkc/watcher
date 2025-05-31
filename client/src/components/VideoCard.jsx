import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
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
  background-color: ${(props) => (props.delete ? "#e74c3c" : "#3498db")};
  color: #fff;
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
          <Btn delete onClick={() => onDelete(video._id)}>
            Delete
          </Btn>
        </Buttons>
      </Info>
    </Card>
  );
};

export default VideoCard;
