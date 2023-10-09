import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../services/AuthContext";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import avatar_img from "../assets/img/user.png";
import ReplyPopover from "./ReplyPopover";
import {
  Box,
  Button,
  Popover,
  Typography,
} from "@mui/material";
import { getLatestMessageTime } from "../services/helper";
import EmojiPicker from "emoji-picker-react";

const Message = (props) => {
  const { user } = useContext(AuthContext);
  const [isReply, setIsReply] = useState(false);
  const [isReacted, setIsReacted] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openEmojiPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeEmojiPicker = () => {
    setAnchorEl(null);
  };
  const openEmoji = Boolean(anchorEl);
  const id = openEmoji ? "simple-popover" : undefined;

  const handleReactClick = (e) => {
    console.log(e);
    setSelectedEmoji(e.emoji);
    setIsReacted(true);
    closeEmojiPicker();
  };

  useEffect(() => {
    // scroll to the bottom of the messages wrapper div
    const messagesWrapper = document.querySelector(".messages-wrapper");
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    if (
      props?.message?.parent_message_id &&
      props?.message?.parent_message_id > 0
    ) {
      setIsReply(true);
    } else setIsReply(false);
  }, []);

  if (!props.message) return;

  return (
    <Box
      sx={{
        display: "flex",
        direction: isReply ? "rtl" : "",
        justifyContent: "start",
        alignItems: "start",
      }}
    >
      <Box
        className={`chat-bubble ${
          props.message.sender_id === user.data.id ? "right" : ""
        }`}
        id={props.message.id}
      >
        <img
          className="chat-bubble__left"
          src={
            !user.data.image_url || user.data.image_url === ""
              ? avatar_img
              : user.data.image_url
          }
          alt="user avatar"
        />
        <Box className="chat-bubble__right">
          <Typography
            variant="h6"
            fontSize={16}
            my={1}
            color="darkcyan"
            className="user-name"
          >
            {user.data.name ? user.data.name : props.message.sender_id}
          </Typography>
          <Typography variant="p" className="user-message">
            {props.message.message}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
            className="chat-bubble__actions"
          >
            <Button
              className="react-button"
              aria-describedby={id}
              variant="text"
              onClick={openEmojiPicker}
              sx={{ flex: 1 }}
            >
              {isReacted ? (
                <Typography fontSize={20} fontWeight={700}>
                  {selectedEmoji ? selectedEmoji : "❤️"}
                </Typography>
              ) : (
                <InsertEmoticonIcon color="info" />
              )}
            </Button>
            <Popover
              id={id}
              open={openEmoji}
              anchorEl={anchorEl}
              onClose={closeEmojiPicker}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <EmojiPicker onEmojiClick={handleReactClick} />
            </Popover>
            <ReplyPopover
              style={{ flex: 1 }}
              chatId={props.chatId}
              messageId={props.message.id}
              sendTestMsg={props.sendTestMsg}
              scroll={props.scroll}
            />
            <Typography
              variant="body2"
              color="grey"
              flex={1}
              textAlign={"center"}
            >
              {getLatestMessageTime([props.message])}
            </Typography>
          </Box>
        </Box>
      </Box>
      {isReply && (
        <Button variant="text" href={"#" + props.message.parent_message_id}>
          <Box className="chat-bubble-reply">
            <img
              className="chat-bubble__left"
              src={
                !user.data.image_url || user.data.image_url === ""
                  ? avatar_img
                  : user.data.image_url
              }
              alt="user avatar"
            />
            <Box className="chat-bubble__right">
              <Typography
                variant="h6"
                fontSize={16}
                my={1}
                color="darkcyan"
                className="user-name"
              >
                {user.data.name ? user.data.name : props.message.sender_id}
              </Typography>
              <Typography variant="p" className="user-message">
                {props.message.message}
              </Typography>
            </Box>
          </Box>
        </Button>
      )}
    </Box>
  );
};

export default Message;
