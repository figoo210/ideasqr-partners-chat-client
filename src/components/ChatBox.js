import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, Typography } from "@mui/material";
import { getOtherChatUserId, generateRandomString, updateMessagesWithMessage, updateMessagesWithReaction } from "../services/helper";
import { VideoCallOutlined } from "@mui/icons-material";
import MultipleSelectChip from "./MultiSelect";
import { v4 as uuidv4 } from 'uuid';


let messagesNumberToLoad = -100;

const ChatBox = (props) => {
  const { user } = useContext(AuthContext);

  const [chatDisplayName, setChatDisplayName] = useState();

  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [members, setMembers] = useState([]);

  const scroll = useRef();
  const scroller = useRef();


  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    if (user.role.role === "admin") {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getSelectedChat = useCallback((chatName, messagesToLoad) => {
    let chat = null;
    // setMessages([]);
    if (props?.data) {
      props.data.forEach((c) => {
        if (c.chat_name === chatName) {
          chat = c;
        }
      });
    }
    if (chat) {
      if (!chat.is_group && props.usersData) {
        setMembers([]);
        props.usersData.forEach((u) => {
          if (getOtherChatUserId(chat.chat_name, user.data.id) === u.id) {
            setChatDisplayName(u.name);
          }
        });
      } else {
        setChatDisplayName(chat.chat_name);
        setMembers(chat.chat_members);
      }
      setAllMessages(chat.messages);
      const sortedMessages = chat.messages.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });
      setMessages(sortedMessages.slice(messagesToLoad));
      return true;
    } else {
      return false;
    }
  }, [user.data.id, props.usersData, props.data]);


  useEffect(() => {
    // get chat room if exist and create one if not exist
    if (props.currentChat) {
      if (!getSelectedChat(props.currentChat, messagesNumberToLoad)) {
        api.getChatOrCreate(props.currentChat).then((chat) => {
          if (chat && !chat.is_group && props.usersData) {
            setMembers([]);
            props.usersData.forEach((u) => {
              if (getOtherChatUserId(chat.chat_name, user.data.id) === u.id) {
                setChatDisplayName(u.name);
              }
            });
          } else {
            setChatDisplayName(chat?.chat_name);
            setMembers(chat?.chat_members);
          }
          props.addChatToData(chat);
          setMessages(chat?.messages);
          setAllMessages(chat?.messages);
        });
      }
    }
  }, [props.currentChat, user.data.id]);


  useEffect(() => {
    if (props.lastMessage) {
      if (props.currentChat === props.lastMessage.chat_id) {
        let updatedMessages = updateMessagesWithMessage(messages, props.lastMessage);
        setMessages(updatedMessages);
        props.setUpdateChatNotification(props.lastMessage);
      }
    }
  }, [props.lastMessage]);

  useEffect(() => {
    if (props.lastReaction) {
      if (props.currentChat === props.lastReaction.chat_id) {
        let updatedMessages = updateMessagesWithReaction(messages, props.lastReaction);
        setMessages(updatedMessages);
      }
    }
  }, [props.lastReaction]);

  useEffect(() => {
    if (props.editedMessage) {
      if (props.currentChat === props.editedMessage.chat_id) {
        let updatedMessages = updateMessagesWithMessage(messages, props.editedMessage);
        setMessages(updatedMessages);
      }
    }
  }, [props.editedMessage]);


  const updateGroupMembers = (m) => {
    api.updateChatMembers({
      chat_id: props.currentChat,
      user_ids: m
    }).then((r) => {
      setMembers(r.data.chat_members);
      props.updateGroupMembersWebsocket(props.currentChat, r.data.chat_members);
    }).catch((e) => {
      console.log(e);
    })
  }


  const handleClickSendMessage = (msg) => {
    if (msg.type === "message") {
      let uuidMessageId = uuidv4();
      msg.id = uuidMessageId;
      if (props.currentChat === msg.chat_id) {
        const tempMessage = {
          id: uuidMessageId,
          chat_id: msg.chat_id,
          message: msg.message,
          sender_id: msg.sender_id,
          parent_message_id: msg?.parent_message_id || "0",
          created_at: new Date(Date.now()).toISOString(),
          seen: false,
          type: "message"
        }
        messagesNumberToLoad = -100;
        setMessages(prevMessages => [...prevMessages, tempMessage].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(-100));
        props.messageSender(tempMessage);
        props.setUpdateChatNotification(props.lastMessage);
      }
      api.createMessage(msg);
    }

    if (msg.type === "reaction") {
      props.messageSender(msg);
    }

    if (msg.type === "edit") {
      props.messageSender(msg);
    }
  };

  const makeCall = () => {
    let chat = null;
    let listOfUsers = [];
    if (props?.data && props?.currentChat) {
      props.data.forEach((c) => {
        if (c.chat_name === props.currentChat) {
          chat = c;
        }
      });
      if (chat && props.usersData) {
        if (!chat.is_group) {
          listOfUsers.push(getOtherChatUserId(chat.chat_name, user.data.id));
        } else {
          if (members.length > 0) {
            listOfUsers = members
              .filter((u) => u.user_id !== user.data.id)
              .map((u) => u.user_id);
          }
        }
        props.makeCallWith(user.data, listOfUsers, generateRandomString(10));
      }
    }
  };


  useEffect(() => {
    const loadMessagesOnScroll = () => {
      if (scroller.current.scrollTop === 0) {
        // When scrolled to the top, load more messages
        let test = allMessages;
        messagesNumberToLoad -= 100;
        setMessages(test.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(messagesNumberToLoad));
      }
    };

    if (scroller.current) {
      scroller.current.addEventListener("scroll", loadMessagesOnScroll);
    }

    return () => {
      if (scroller.current) {
        scroller.current.removeEventListener("scroll", loadMessagesOnScroll);
      }
    };
  }, [allMessages]);


  return (
    <main
      className="chat-box"
      style={{ backgroundColor: props.currentChat ? "#ddd" : "transparent" }}
    >
      {props.currentChat && (
        <Box
          sx={{
            width: "100%",
            height: "18%",
            bgcolor: "#eee",
            borderBottom: "1px solid",
            position: "relative",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={500}
            sx={{ position: "absolute", bottom: 20, left: 20 }}
          >
            {chatDisplayName}
            {members.length > 0 && (
              <>
                <Tooltip title={members.map((member, idx) => (
                  <Box key={idx}>
                    {props.usersData.map((user, idx) => (
                      <Typography color="darkblue" variant="body1" key={idx}>
                        {user.id === member.user_id && user.name}
                      </Typography>
                    ))}
                  </Box>
                ))}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={18}
                    color="GrayText"
                    onClick={handleOpenDialog}
                    sx={{ cursor: "pointer", borderBottom: "1px solid grey" }}
                  >
                    {members.length} Members
                  </Typography>
                </Tooltip>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Group Members</DialogTitle>
                  <DialogContent>
                    <Box
                      sx={{
                        border: 0,
                        bgcolor: "background.paper",
                        width: 500,
                      }}
                    >
                      <MultipleSelectChip width={"100%"} members={members.map(obj => obj.user_id)} getMembers={updateGroupMembers} />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Done</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Typography>
          {user.role.permissions.some(
            (perm) => perm.permission === "make calls"
          ) && (
              <Button
                sx={{
                  bgcolor: "black",
                  padding: 1,
                  position: "absolute",
                  right: 10,
                  top: 0,
                  bottom: 0,
                  margin: "auto",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                  height: "70%",
                }}
                onClick={makeCall}
              >
                <VideoCallOutlined sx={{ color: "#f07d00", fontSize: 35 }} />
              </Button>
            )}
        </Box>
      )}
      <div className="messages-wrapper" ref={scroller}>
        {messages?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))?.map((message, idx) => (
          <Message
            key={idx}
            scroll={scroll}
            message={message}
            chatId={props.currentChat}
            sendTestMsg={handleClickSendMessage}
            usersData={props.usersData}
            messages={messages?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))}
          />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage
        scroll={scroll}
        chatId={props.currentChat}
        sendTestMsg={handleClickSendMessage}
      />
    </main>
  );
};

export default ChatBox;
