import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Google from "../img/google.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.soft};
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  width: 70%;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-left: 11rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 10px;
`;

const Section = styled.div`
  flex: 1;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Divider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.soft};
  margin: 0px 100px 0px 100px;
`;

const OthersDiv = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 300;
  color: ${({ theme }) => theme.textSoft};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.text};
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
    color: ${({ theme }) => theme.bgLighter};
  }
`;

const GoogleImg = styled.img`
  height: 100px;
  cursor: pointer;
  margin-top: 20px;
`;

const More = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signin`,
        { name, password }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        {
          name,
          email,
          password,
        }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      console.error("Signup Error:", err);
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate("/");
          });
      })
      .catch(() => {
        dispatch(loginFailure());
      });
  };

  return (
    <Container>
      <Wrapper>
        <Section>
          <Title>Sign In</Title>
          <Input
            placeholder="username"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>Sign in</Button>
        </Section>

        <Divider />

        <Section>
          <Title>Sign Up</Title>
          <Input
            placeholder="username"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSignUp}>Sign up</Button>
        </Section>
      </Wrapper>

      <OthersDiv>
        <Title>or</Title>
        <GoogleImg src={Google} onClick={signInWithGoogle} />
        <More>
          English (USA)
          <Links>
            <Link>Help</Link>
            <Link>Privacy</Link>
            <Link>Terms</Link>
          </Links>
        </More>
      </OthersDiv>
    </Container>
  );
};

export default SignIn;
