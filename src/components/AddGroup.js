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
import UploadImageField from "./UploadImageField";

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
      props.getAddedData(chat)
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

        <UploadImageField getUrl={setProfilePic}  />

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
