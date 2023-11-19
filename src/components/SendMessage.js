import React, { useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../services/AuthContext";
import InputEmoji from "react-input-emoji";
import AttachmentsUpload from "./AttachmentsUpload";

const SendMessage = ({ scroll, chatId, sendTestMsg }) => {
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [shortcutMessage, setShortcutMessage] = useState("");
  const [isBtnDisabled, setBtnDisabled] = useState(true);

  const messageHandler = (t) => {
    let text = t; // document.querySelector(".react-input-emoji--input")?.textContent;
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

  useEffect(() => {
    function getFocusedInput(m) {
      const focusedElement = document.activeElement;
      if (focusedElement.tagName !== 'INPUT') {
        setMessage(m);
      }
    }
    const handleKeyPress = (event) => {
      const shortcuts = user.data.reply_shortcuts;
      if (event.ctrlKey) {
        for (let i = 1; i <= 9; i++) {
          if (event.key === `${i}`) {
            getFocusedInput(shortcuts[i - 1].reply);
          }
        }
      }
    };
    // Attach the event listener when the component mounts
    document.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [])

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
          maxLength={5000}
        />
        {chatId && <AttachmentsUpload sendMsg={sendTestMsg} chatId={chatId} />}
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
