import { useEffect, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
import UserImg from "../img/user.png";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 50px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 30%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  width: 90%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 2px 5px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 300;
  font-size: small;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #999;
`;
const StyledSearchIcon = styled(SearchOutlinedIcon)`
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  padding: 2px;
  border-radius: 4px;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setQ("");
    }
  }, [location.pathname]);
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim()) {
                  navigate(`/search?q=${q.trim()}`);
                }
              }}
            />

            <StyledSearchIcon
              onClick={() => {
                if (q.trim()) {
                  navigate(`/search?q=${q.trim()}`);
                }
              }}
            />
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
              <Avatar src={currentUser.img ? currentUser.img : UserImg} />
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
