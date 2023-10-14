import React, { useState } from 'react';
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { storage } from "../services/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button } from '@mui/material';
import { Delete, Done } from '@mui/icons-material';
import { styled } from "@mui/material/styles";


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


function UploadImageField(props) {
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [storageState, setStorageState] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);


  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    const storageRef = ref(
      storage,
      `profile_pics/${file.name}`
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

          props.getUrl(downloadURL);
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

  return (
      <div>
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

    </div>
  )
}

export default UploadImageField