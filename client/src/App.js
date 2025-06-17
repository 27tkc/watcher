import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import VideoNotFound from "./pages/VideoNotFound";
import Settings from "./pages/Settings";
import Search from "./pages/Search";

const Container = styled.div`
  display: flex;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.bg};
  height: 100vh;
  color: ${({ theme }) => theme.text};
`;
const Main = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 20px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                  <Route path="settings" element={<Settings />} />
                  <Route path="search" element={<Search />} />
                </Route>
                <Route path="/video-not-found" element={<VideoNotFound />} />
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
