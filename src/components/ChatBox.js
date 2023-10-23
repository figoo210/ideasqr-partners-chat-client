import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";
import { Box, Button, IconButton, Popper, Typography } from "@mui/material";
import { getOtherChatUserId, generateRandomString } from "../services/helper";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { VideoCallOutlined } from "@mui/icons-material";

const ChatBox = (props) => {
  const { user } = useContext(AuthContext);

  const [chatDisplayName, setChatDisplayName] = useState();

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);

  const scroll = useRef();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePoper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const openPoper = Boolean(anchorEl);
  const id = openPoper ? "simple-popper" : undefined;

  // WebSocket
  const [socketUrl, setSocketUrl] = useState(
    process.env.REACT_APP_WEBSOCKET_URL
  );
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const newChat = (chatId) => {
    api.getChatOrCreate(chatId).then((chat) => {
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
      setMessages(chat.messages);
    });
  };

  const getSelectedChat = (chatName) => {
    let chat = null;
    setMessages([]);
    props.data.forEach((c) => {
      if (c.chat_name === chatName) {
        chat = c;
      }
    });
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
      setMessages(chat.messages);
      return true;
    } else {
      return false;
    }
  };

  const getUpdatedChat = (chatId) => {
    api
      .chatMessages(chatId)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Check web socket status
    console.log(connectionStatus);
    if (connectionStatus === "Closing" || connectionStatus === "Closed") {
      window.location.reload();
    }

    // if (messageAction !== oldAction) {
    //   console.log("Action Here");
    // }

    // get chat room if exist and create one if not exist
    if (props.currentChat) {
      if (!getSelectedChat(props.currentChat)) {
        newChat(props.currentChat);
      }
    }

    if (lastJsonMessage && props.currentChat) {
      props.updateChats(Math.random());
      getUpdatedChat(props.currentChat);
    }
  }, [props.currentChat, lastJsonMessage, user.data.id, connectionStatus]);

  const handleClickSendMessage = (msg) => {
    sendJsonMessage(msg);
  };

  const makeCall = () => {
    let chat = null;
    const listOfUsers = [];
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
            .filter((u) => u.id !== user.data.id)
            .map((u) => u.id);
        }
      }
      props.makeCallWith(user.data, listOfUsers, generateRandomString(10));
    }
  };

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
                <Typography
                  variant="body1"
                  fontWeight={500}
                  fontSize={18}
                  color="GrayText"
                  onClick={handlePoper}
                  sx={{ cursor: "pointer", borderBottom: "1px solid grey" }}
                >
                  {members.length} Members
                </Typography>
                <Popper id={id} open={openPoper} anchorEl={anchorEl}>
                  <Box
                    sx={{
                      border: 1,
                      p: 3,
                      bgcolor: "background.paper",
                    }}
                  >
                    {members.map((member, idx) => (
                      <Box key={idx}>
                        {props.usersData.map((user, idx) => (
                          <Typography
                            color="darkblue"
                            variant="body1"
                            key={idx}
                          >
                            {user.id === member.user_id && user.name}
                          </Typography>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Popper>
              </>
            )}
          </Typography>
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
        </Box>
      )}
      <div className="messages-wrapper">
        {messages?.map((message, idx) => (
          <Message
            key={idx}
            scroll={scroll}
            message={message}
            chatId={props.currentChat}
            sendTestMsg={handleClickSendMessage}
            usersData={props.usersData}
            messages={messages}
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
