import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import UsersList from "../components/UsersList";
import { GroupAdd, PersonAdd } from "@mui/icons-material";
import CustomModal from "../components/Modal";
import AddUser from "../components/AddUser";
import AddGroup from "../components/AddGroup";
import api from "../services/api";

function Chats(props) {
  const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);

  const [currentChat, setCurrentChat] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [updateChats, setUpdateChats] = useState(null);

  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const openAddUsersModal = () => {
    setUsersModalOpen(true);
  };

  const openAddGroupModal = () => {
    setAddGroupOpen(true);
  };

  const getChat = (chatName) => {
    setCurrentChat(chatName);
    data.forEach((e) => {
      if (e.chat_name === chatName) {
        setSelectedChat(e);
      }
    });
  };

  const getAddedData = (d) => {
    setData([...data, d]);
  };

  const getAddedUser = (d) => {
    setUsersData([...usersData, d]);
  };

  useEffect(() => {
    setData(null);
    // Get Data
    api.getUsers().then((response) => {
      setUsersData(response.data);
    });

    const getData = async () => {
      if (props.page === "Contact List") {
        api.getUsers().then((response) => {
          setData(response.data);
        });
      } else if (props.page === "Groups") {
        api.getChats().then((response) => {
          let groupChats = [];
          response.data.forEach((element) => {
            if (element.is_group) {
              groupChats.push(element);
            }
          });
          setData(groupChats);
        });
      } else if (props.page === "Messages") {
        api.getChats().then((response) => {
          let directChats = [];
          response.data.forEach((element) => {
            if (!element.is_group) {
              directChats.push(element);
            }
          });
          setData(directChats);
        });
      }

      return data;
    };

    getData();
  }, [props.page, updateChats]);
  return (
    <>
      <Box
        height={"100vh"}
        borderRight={3}
        sx={{ width: "23%", backgroundColor: "#ccc" }}
      >
        <Box sx={{ padding: 3, margin: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, marginTop: 8, marginBottom: 2 }}
            >
              {props.page}
            </Typography>
            {props.page === "Contact List" && (
              <>
                <Tooltip title="Add User">
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: 5 }}
                    onClick={openAddUsersModal}
                  >
                    <PersonAdd />
                  </Button>
                </Tooltip>
                <CustomModal
                  open={usersModalOpen}
                  modalTitle={"Add User"}
                  updateOpenValue={setUsersModalOpen}
                  ModalContent={AddUser}
                  getAddedData={getAddedUser}
                />
              </>
            )}
            {props.page === "Groups" && (
              <>
                <Tooltip title="Add Group">
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: 5 }}
                    onClick={openAddGroupModal}
                  >
                    <GroupAdd />
                  </Button>
                </Tooltip>
                <CustomModal
                  open={addGroupOpen}
                  modalTitle={"Add Group"}
                  updateOpenValue={setAddGroupOpen}
                  ModalContent={AddGroup}
                  getAddedData={getAddedData}
                />
              </>
            )}
          </Box>
          <TextField
            label="Search input"
            variant="standard"
            InputProps={{
              type: "search",
            }}
            sx={{
              cursor: "text",
              width: "100%",
              marginBottom: 3,
            }}
            color="primary"
          />
          {props.page !== "Contact List" && (
            <ChatList getChat={getChat} data={data} usersData={usersData} updateChats={setUpdateChats} />
          )}
          {props.page === "Contact List" && (
            <UsersList getChat={getChat} data={data} updateChats={setUpdateChats} />
          )}
        </Box>
      </Box>
      <Box height={"100vh"} sx={{ width: "60%", backgroundColor: "#ccc" }}>
        <ChatBox
          currentChat={currentChat}
          selectedChat={selectedChat}
          usersData={usersData}
        />
      </Box>
    </>
  );
}

export default Chats;
