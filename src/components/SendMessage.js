import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, TextareaAutosize } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../services/AuthContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachmentsUpload from "./AttachmentsUpload";

const SendMessage = ({ scroll, chatId, sendTestMsg }) => {
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [shortcutMessage, setShortcutMessage] = useState("");
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmojiToMessage = (e) => {
    const emoji = e.native;
    const cursorPos = textareaRef.current.selectionStart;
    const newMessage =
      message.substring(0, cursorPos) + emoji + message.substring(cursorPos);
    setMessage(newMessage);
    // Move the cursor after the inserted emoji
    textareaRef.current.selectionStart = cursorPos + emoji.length;
    textareaRef.current.selectionEnd = cursorPos + emoji.length;
    textareaRef.current.focus(); // Ensure the textarea retains focus
  };

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const messageHandler = (e) => {
    let text = e.target.value;
    if (text.trim() === "" || !text) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
    setMessage(text);
  };

  const onEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents the default behavior (new line)
      setShowEmojiPicker(false);
      sendMessages();
    }
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
      type: "message"
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
        if (focusedElement.tagName === "TEXTAREA" && focusedElement.textContent.length > 0) {
          setMessage(focusedElement.textContent + " " + m);
        } else {
          setMessage(m);
        }
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
        <TextareaAutosize
          maxRows={3}
          maxLength={5000}
          value={message}
          onChange={messageHandler}
          onKeyDown={onEnter}
          className="form-input__input"
          placeholder="type message..."
          id="messageInput"
          name="messageInput"
          style={{
            width: "95%",
            minHeight: "50px",
            maxHeight: "60px",
            borderRadius: "5px",
            resize: "none",
            fontSize: "18px"
          }}
          ref={textareaRef}
        />
        <InsertEmoticonIcon
          fontSize="large"
          sx={{ mx: 1, color: 'gray', cursor: 'pointer' }}
          onClick={toggleEmojiPicker}
        />
        {showEmojiPicker && (
          <Box sx={{ position: "absolute", bottom: 90, right: 20, zIndex: 10000 }} ref={emojiPickerRef}>
            <Picker data={data} onEmojiSelect={addEmojiToMessage} />
          </Box>
        )}
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
