import React, { useContext, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  TextField,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { AuthContext } from "../services/AuthContext";
import Notification from "../components/Notification";
import Assets from "../assets/data";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const closeNotification = () => {
    setIsError(false);
  };

  const { login } = useContext(AuthContext);

  const onLogin = async (e) => {
    e.preventDefault();
    login(email, password, "ipAddress").catch((e) => {
      setIsError(true);
      setError(e.response.data.detail);
    });
    // axios
    // .get("https://ipinfo.io/json")
    // .then((response) => response.data)
    // .then((data) => {
    //   const ipAddress = data.ip;
    //   login(email, password, ipAddress).catch((e) => {
    //     setIsError(true);
    //     setError(e.response.data.detail);
    //   });
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });
  };

  return (
    <main className="welcome">
      <h1>Welcome to Partners Chat.</h1>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={onLogin}
            noValidate
            sx={{ padding: 3 }}
            bgcolor={"white"}
          >
            {isError && (
              <Notification
                open={isError}
                handleClose={closeNotification}
                msgType="error"
                msg={error}
              />
            )}
            <img src={Assets.logoPic} alt="collaborate" width={"100%"} />
            <Typography component="h1" variant="h5">
              Sign in to chat with your partners.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </Container>
    </main>
  );
};

export default Welcome;
