import React, { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";

import InputEmoji from "react-input-emoji";

const SendMessage = ({ scroll, chatId, sendTestMsg }) => {
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [isBtnDisabled, setBtnDisabled] = useState(true);

  const messageHandler = (text) => {
    if (text.trim() === "" || !text) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
    setMessage(text);
  };

  const onEnter = (e) => {
    sendMessages();
  };

  const sendMessages = async () => {
    if (message.trim() === "" || !chatId) {
      setBtnDisabled(true);
      return;
    }
    console.log("sent!");
    const newMessage = {
      chat_id: chatId,
      sender_id: user.data.id,
      message: message,
    };
    sendTestMsg(newMessage);
    setMessage("");
    setBtnDisabled(true);
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendMessages();
      }}
      className="send-message"
    >
      <Box
        sx={{
          bgcolor: "#ddd",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InputEmoji
          value={message}
          onChange={messageHandler}
          className="form-input__input"
          placeholder="type message..."
          id="messageInput"
          name="messageInput"
          keepOpened
          onEnter={onEnter}
        />
      </Box>
      <Button
        disabled={isBtnDisabled}
        type="submit"
        variant="contained"
        endIcon={<SendIcon />}
      >
        Send
      </Button>
    </form>
  );
};

export default SendMessage;