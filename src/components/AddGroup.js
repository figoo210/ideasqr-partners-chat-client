import { Box, Button, TextField } from "@mui/material";

import React, { useContext, useState } from "react";
import api from "../services/api";
import MultipleSelectChip from "./MultiSelect";
import UploadImageField from "./UploadImageField";
import { AuthContext } from "../services/AuthContext";

function AddGroup(props) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const getMembers = (membersList) => {
    !membersList.includes(user.data.id) && membersList.push(user.data.id);
    setMembers(membersList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // check group name
    api.checkGroupName(name).then((r) => {
      if (r.data.is_exist) {
        setIsError(true);
        setErrorMsg("Group already exist.");
      } else {
        // Handle form submission here
        const newGroup = {
          chat_name: name,
          is_group: true,
          members: members,
          image_url: profilePic,
        };
        api.createChatGroup(newGroup).then((chat) => {
          props.getAddedData(chat);
        });

        // Close modal after save
        props.closeModal();
      }
    })
  };

  return (
    <Box sx={{ minWidth: "80%" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%", display: "flex" }}>
          <TextField
            sx={{ flex: 1, mx: 1 }}
            label="Group Name"
            value={name}
            onChange={(event) => {
              setIsError(false);
              setErrorMsg("");
              setName(event.target.value);
            }}
            margin="normal"
            required
            error={isError}
            helperText={errorMsg}
          />
          <MultipleSelectChip getMembers={getMembers} />
        </Box>

        <UploadImageField getUrl={setProfilePic} />

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
