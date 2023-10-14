import React, { useContext, useState } from 'react';
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../services/AuthContext';
import Assets from "../assets/data";
import api from '../services/api';
import UploadImageField from "./UploadImageField";

const ProfileManagement = () => {
  const { user, loading, updateProfile } = useContext(AuthContext);
  const [userUpdated, setUserUpdated] = useState({
    email: '',
    password: '',
    name: '',
    image_url: '',
    role_name: '',
    disabled: false,
    ip_group_id: '',
  });

  const [showPassword, setShowPassword] = useState(false);

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

  const handleChange = (event) => {
    setUserUpdated((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  };

    const getImageUrl = (url) => {
        setUserUpdated((prevUser) => ({
            ...prevUser,
            ["image_url"]: url,
        }));
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send the updated user data to the server
    const response = await api.updateUser(user.data.id, userUpdated);
    const updatedUser = await response.data;
      updateProfile(updatedUser);
  };

  if (loading) {
    return <></>;
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <img src={user.data.image_url ? user.data.image_url : Assets.avatar} alt="User Avatar" width={100} style={{ margin: "auto", marginTop: 5, marginBottom: 3 }} />
      <Typography variant="h5" align="center" gutterBottom>
        Profile Management
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.data.email ? user.data.email : userUpdated.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={user.data.password ? user.data.password : userUpdated.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!validatePassword(userUpdated.password)}
            helperText={
              !validatePassword(userUpdated.password)
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
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.data.name ? user.data.name : userUpdated.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <UploadImageField getUrl={getImageUrl} />
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default ProfileManagement;
