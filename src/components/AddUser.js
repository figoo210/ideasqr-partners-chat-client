import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../services/api";
import UploadImageField from "./UploadImageField";

function AddUser(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [roles, setRoles] = useState([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = emailRegex.test(email);
    return isValid;
  };

  const emailExistsInUsersData = (email) => {
    return props.usersData.some((user) => user.email === email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let isValid = passwordRegex.test(password);
    return isValid;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    if (emailExistsInUsersData(email)) {
      return;
    }

    const newUser = {
      name: name,
      email: email,
      password: password,
      role_name: role,
      image_url: profilePic,
    };
    api.register(newUser).then((resp) => {
      props.getAddedData(resp.data);
    });

    // Close modal after save
    props.closeModal();
  };

  useEffect(() => {

    // Get Roles
    api
      .getRoles()
      .then((response) => {
        let data = response.data;
        setRoles(data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, [])

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%", display: "flex" }}>
          <TextField
            sx={{ flex: 1, mx: 1 }}
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required
          />
          <TextField
            sx={{ flex: 1, mx: 1 }}
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            margin="normal"
            required
            error={!validateEmail(email) || emailExistsInUsersData(email)}
            helperText={!validateEmail(email) ? "Invalid email format" : (emailExistsInUsersData(email) ? "Email already exist" : "")}
          />
        </Box>
        <Box sx={{ width: "100%", display: "flex" }}>
          <TextField
            sx={{ flex: 1, mx: 1 }}
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            margin="normal"
            error={!validatePassword(password)}
            helperText={
              !validatePassword(password)
                ? "Password must contain at least 8 characters, including at least 1 uppercase letter, 1 lowercase letter, and 1 number."
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl margin="normal" sx={{ flex: 1, mx: 1 }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Role"
              required
              onChange={(event) => setRole(event.target.value)}
            >
              {roles && roles.map((r, idx) => (
                <MenuItem key={idx} value={r.role}>{r.role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <UploadImageField getUrl={setProfilePic} />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: 1, width: "100%", mx: 1 }}
        >
          Add New User
        </Button>
      </form>
    </Box>
  );
}

export default AddUser;
