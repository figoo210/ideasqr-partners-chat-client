import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";
import { Box, Popper, Typography } from "@mui/material";
import { getOtherChatUserId } from "../services/helper";
import useWebSocket from "react-use-websocket";

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
  const [socketUrl, setSocketUrl] = useState("ws://localhost:8000/ws/chats");
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    // get chat room if exist and create one if not exist
    if (props.currentChat) {
      const getChatData = (chatId) => {
        api.getChatOrCreate(chatId).then((chat) => {
          if (!chat.is_group) {
            setMembers([]);
            api
              .getUser(getOtherChatUserId(chat.chat_name, user.data.id))
              .then((response) => {
                setChatDisplayName(response.data.name);
              });
          } else {
            setChatDisplayName(chat.chat_name);
            setMembers(chat.chat_members);
          }
          setMessages(chat.messages);
        });
      };

      getChatData(props.currentChat);
    }
  }, [props.currentChat, lastJsonMessage, user.data.id]);

  const handleClickSendMessage = (msg) => {
    sendJsonMessage(msg);
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