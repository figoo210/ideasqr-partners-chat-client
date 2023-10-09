import React, { useContext, useState } from "react";

import welcomeLogo from "../assets/img/collaborate.png";

import {
  Box,
  Button,
  TextField,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { AuthContext } from "../services/AuthContext";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <main className="welcome">
      <h1>Welcome to Partners Chat.</h1>
      <br />
      <br />
      <img src={welcomeLogo} alt="collaborate" width={100} />
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
          <Typography component="h1" variant="h5">
            Sign in to chat with with your partners.
          </Typography>
          <Box
            component="form"
            onSubmit={onLogin}
            noValidate
            sx={{ mt: 2, padding: 3, borderRadius: 5 }}
            bgcolor={"white"}
          >
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
