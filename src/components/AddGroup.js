import { Box, Button, TextField } from "@mui/material";

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Delete, Done } from "@mui/icons-material";
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
import MultipleSelectChip from "./MultiSelect";

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

function AddGroup(props) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [storageState, setStorageState] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const getMembers = (membersList) => {
    setMembers(membersList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    const newGroup = {
      chat_name: name,
      is_group: true,
      members: members,
      image_url: profilePic,
    };
    console.log(newGroup);
    api.createChatGroup(newGroup).then((chat) => {
      window.location.reload();
    });

    // Close modal after save
    props.closeModal();
  };

  return (
    <Box sx={{ minWidth: "80%" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%", display: "flex" }}>
          <TextField
            sx={{ flex: 1, mx: 1 }}
            label="Group Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required
          />
          <MultipleSelectChip getMembers={getMembers} />
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
            {uploaded ? "Uploaded" : "Upload Group Picture"}
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
              alt="Group Preview"
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
          Add New Group
        </Button>
      </form>
    </Box>
  );
}

export default AddGroup;
