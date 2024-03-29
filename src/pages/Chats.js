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
import { isMessageAddedToChat, updateChatGroupWithMembers, updateChatWithMessage, updateChatWithMessageReactions } from "../services/helper";
import Loading from "./Loading";
import Assets from "../assets/data";


const pattern = /^chat-\d+-\d+$/;


function Chats(props) {
  const { user } = React.useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [searchField, setSearchField] = useState("");

  const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [dChats, setDChats] = useState(null);
  const [gChats, setGChats] = useState(null);

  const [currentChat, setCurrentChat] = useState(null);
  const [updateChatNotification, setUpdateChatNotification] = useState(null);
  const [updateChatBox, setUpdateChatBox] = useState(null);

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
    props.messageSender({
      type: "new_group_added",
      data: d
    });
  };

  const getAddedUser = (d) => {
    props.messageSender({
      type: "new_user_added",
      data: d
    });
  };

  const getData = async () => {
    try {
      const [usersResponse, directChatsResponse, groupChatsResponse] = await Promise.all([
        api.getUsers(),
        api.getDirectChats(),
        api.getGroupChats(),
      ]);
      setIsLoading(false);
      props.getAllUsers(usersResponse.data);
      setUsersData(usersResponse.data);

      props.getAllGroups(groupChatsResponse.data);
      setDChats(directChatsResponse.data);
      setGChats(groupChatsResponse.data);
      setData(directChatsResponse.data);
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  const updateLists = (d) => {
    if (props.page === "Groups") {
      if (gChats) {
        setData(d ? d.groupChats : gChats);
      }
    } else if (props.page === "Messages") {
      if (dChats) {
        setData(d ? d.directChats : dChats);
      }
    }
  };

  const addChatToData = (chat) => {
    if (chat) {
      setData([...data, chat]);
      if (chat.is_group) {
        setGChats([...gChats, chat]);
      } else {
        setDChats([...dChats, chat]);
      }
    }
  };

  useEffect(() => {
    updateLists();
  }, [props.page]);

  useEffect(() => {
    if (props.lastMessage) {
      for (let i = 0; i < props.messagesQueue.length; i++) {
        const element = props.messagesQueue[i];
        if (!pattern.test(element.chat_id)) {
          if (!isMessageAddedToChat(gChats, element)) {
            let d = updateChatWithMessage(gChats, element);
            setGChats(d);
            if (currentChat === element.chat_id) {
              setData(d);
            }
          }
        } else {
          if (!isMessageAddedToChat(dChats, element)) {
            let d = updateChatWithMessage(dChats, element);
            setDChats(d);
            if (currentChat === element.chat_id) {
              setData(d);
            }
          }
        }
      }
    }
  }, [props.lastMessage]);

  useEffect(() => {
    if (props.editedMessage) {
      if (!pattern.test(props.editedMessage.chat_id)) {
        let d = updateChatWithMessage(gChats, props.editedMessage);
        setGChats(d);
        if (currentChat === props.editedMessage.chat_id) {
          setData(d);
        }
      } else {
        let d = updateChatWithMessage(dChats, props.editedMessage);
        setDChats(d);
        if (currentChat === props.editedMessage.chat_id) {
          setData(d);
        }
      }
    }
  }, [props.editedMessage]);

  useEffect(() => {
    if (props.lastReaction) {
      if (!pattern.test(props.lastReaction.chat_id)) {
        let d = updateChatWithMessageReactions(gChats, props.lastReaction);
        setGChats(d);
        if (currentChat === props.lastReaction.chat_id) {
          setData(d);
        }
      } else {
        let d = updateChatWithMessageReactions(dChats, props.lastReaction);
        setDChats(d);
        if (currentChat === props.lastReaction.chat_id) {
          setData(d);
        }
      }
    }
  }, [props.lastReaction]);

  useEffect(() => {
    if (props.chatGroupMembersUpdated) {
      let d = updateChatGroupWithMembers(gChats, props.chatGroupMembersUpdated);
      setGChats(d);
      if (currentChat === props.chatGroupMembersUpdated.chat_id) {
        setData(d);
      }
    }
  }, [props.chatGroupMembersUpdated]);

  useEffect(() => {
    if (props.newUserAdded) {
      setUsersData([...usersData, props.newUserAdded.data]);
    }
  }, [props.newUserAdded]);

  useEffect(() => {
    if (props.newGroupAdded) {
      setGChats([...gChats, props.newGroupAdded.data]);
      if (props.page === "Groups") {
        setData([...data, props.newGroupAdded.data]);
      }
    }
  }, [props.newGroupAdded]);


  return (
    <>
      {isLoading ? (
        <Box
          height={"auto"}
          sx={{ width: "82%", backgroundColor: "#f0f1f5" }}
        >
          <Loading onLoad={getData} />
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
                  data={usersData}
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
              setUpdateChatNotification={setUpdateChatNotification}
              makeCallWith={props.makeCallWith}
              updateGroupMembersWebsocket={props.updateGroupMembers}
              messageSender={props.messageSender}
              addChatToData={addChatToData}
              updateChatBox={updateChatBox}
              lastMessage={props.lastMessage}
              messagesQueue={props.messagesQueue}
              lastReaction={props.lastReaction}
              editedMessage={props.editedMessage}
            />
          </Box>
        </>
      ))}
    </>
  );
}

export default Chats;
