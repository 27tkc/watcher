import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  width: 100%;
  text-align: center;
`;

const SpinnerCircle = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #555;
`;

const Spinner = ({ text }) => (
  <SpinnerWrapper>
    <SpinnerCircle />
    <LoadingText>{text}</LoadingText>
  </SpinnerWrapper>
);

export default Spinner;
