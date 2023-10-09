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

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Delete, Done, Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { storage } from "../services/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import api from "../services/api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddUser(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [storageState, setStorageState] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = emailRegex.test(email);
    return isValid;
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

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    const storageRef = ref(
      storage,
      `profile_pics/${name !== "" ? name : file.name}`
    );
    setStorageState(storageRef);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploading(true);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploading(false);

          setProfilePic(downloadURL);
          setProfilePicPreview(URL.createObjectURL(file));
          setUploaded(true);
        });
      }
    );
  };

  const deleteUploadedImage = () => {
    // Delete the file
    deleteObject(storageState)
      .then(() => {
        // File deleted successfully
        setProfilePicPreview("");
        setUploaded(false);
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    const newUser = {
      name: name,
      email: email,
      password: password,
      role_name: role,
      image_url: profilePic,
    };
    api.register(newUser);

    // Close modal after save
    props.closeModal();
  };

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
            error={!validateEmail(email)}
            helperText={!validateEmail(email) ? "Invalid email format" : ""}
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
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Manager"}>Manager</MenuItem>
              <MenuItem value={"User"}>User</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {uploading ? (
          <LoadingButton
            loading
            startIcon={<SaveIcon />}
            sx={{
              mx: 1,
              width: "100%",
              my: 5,
              height: "60px",
            }}
            variant="outlined"
          >
            Uploading....
          </LoadingButton>
        ) : (
          <Button
            component="label"
            variant="contained"
            startIcon={uploaded ? <Done /> : <CloudUploadIcon />}
            sx={{
              height: "60px",
              mx: 1,
              width: "100%",
              my: 3,
            }}
            color="warning"
            disabled={uploaded}
          >
            {uploaded ? "Uploaded" : "Upload Profile Picture"}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
          </Button>
        )}

        {profilePicPreview && (
          <Box
            textAlign="center"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={deleteUploadedImage}
              sx={{ mb: 1 }}
            >
              Delete
            </Button>
            <img
              src={profilePicPreview}
              width="200px"
              height="200px"
              alt="Profile Pic Preview"
            />
          </Box>
        )}

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
