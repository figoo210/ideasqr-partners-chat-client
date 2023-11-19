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
import { AuthContext } from "../services/AuthContext";
import { updateChatsWithChat } from "../services/helper";
import Loading from "./Loading";
import Assets from "../assets/data";

function Chats(props) {
  const { user } = React.useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [searchField, setSearchField] = useState("");

  const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [dChats, setDChats] = useState(null);
  const [gChats, setGChats] = useState(null);

  const [currentChat, setCurrentChat] = useState(null);
  const [updateChats, setUpdateChats] = useState(null);
  const [updateChatNotification, setUpdateChatNotification] = useState(null);
  const [updateAllData, setUpdateAllData] = useState(null);

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
  };

  const getAddedData = (d) => {
    setData([...data, d]);
    getData();
  };

  const getAddedUser = (d) => {
    setUsersData([...usersData, d]);
    getData();
  };

  const getData = async () => {
    api.getUsers().then((response) => {
      props.getAllUsers(response.data);
      setUsersData(response.data);
    });

    api.getChats().then((response) => {
      let groupChats = [];
      let directChats = [];
      response.data.forEach((element) => {
        if (element.is_group) {
          groupChats.push(element);
        } else {
          directChats.push(element);
        }
      });
      props.getAllGroups(groupChats)
      setDChats(directChats);
      setGChats(groupChats);
      return { directChats: directChats, groupChats: groupChats };
    }).then((r) => {
      setIsLoading(false);
      updateLists(r);
    });
  };

  const updateLists = (d) => {
    if (props.page === "Contact List") {
      if (usersData) {
        setData(usersData);
      }
    } else if (props.page === "Groups") {
      if (gChats) {
        setData(d ? d.groupChats : gChats);
      }
    } else if (props.page === "Messages") {
      if (dChats) {
        setData(d ? d.directChats : dChats);
      }
    }
  }

  useEffect(() => {
    getData();
  }, [updateAllData]);

  useEffect(() => {
    updateLists();
  }, [props.page]);

  useEffect(() => {
    if (updateChats) {
      api.getChatById(updateChats[0]).then((response) => {
        const singleChat = response.data;
        if (currentChat === singleChat.chat_name) {
          let d = updateChatsWithChat(data, singleChat);
          setData(d);
        }
        if (singleChat.is_group) {
          let d = updateChatsWithChat(gChats, singleChat);
          setGChats(d);
        } else {
          let d = updateChatsWithChat(dChats, singleChat);
          setDChats(d);
        }
      });

    }
  }, [updateChats]);

  return (
    <>
      {isLoading ? (
        <Box
          height={"auto"}
          sx={{ width: "82%", backgroundColor: "#f0f1f5" }}
        >
          <Loading />
        </Box>
      ) : (props.page === "" ? (
        <Box
          height={"100vh"}
          sx={{
            width: "82%",
            backgroundColor: "#f0f1f5",
            backgroundImage: `url(${Assets.homeImg})`,
            backgroundSize: "cover",  // To cover the entire box
            backgroundPosition: "center", // To center the image
          }}
        >
        </Box>
      ) : (
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
                {props.page === "Contact List" &&
                  user.role.permissions.some(
                    (perm) => perm.permission === "create users"
                  ) && (
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
                        usersData={usersData}
                      />
                    </>
                  )}
                {props.page === "Groups" &&
                  user.role.permissions.some(
                    (perm) => perm.permission === "create groups"
                  ) && (
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
                onChange={(e) => setSearchField(e.target.value)}
              />
              {props.page !== "Contact List" && (
                <ChatList
                  getChat={getChat}
                  data={data}
                  usersData={usersData}
                  searchField={searchField}
                  updateChatNotification={updateChatNotification}
                />
              )}
              {props.page === "Contact List" && (
                <UsersList
                  getChat={getChat}
                  data={data}
                  searchField={searchField}
                />
              )}
            </Box>
          </Box>
          <Box height={"100vh"} sx={{ width: "60%", backgroundColor: "#ccc" }}>
            <ChatBox
              currentChat={currentChat}
              data={data}
              usersData={usersData}
              updateChats={setUpdateChats}
              setUpdateAllData={setUpdateAllData}
              setUpdateChatNotification={setUpdateChatNotification}
              makeCallWith={props.makeCallWith}
            />
          </Box>
        </>
      ))}
    </>
  );
}

export default Chats;
