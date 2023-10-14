import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../services/AuthContext";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import avatar_img from "../assets/img/user.png";
import ReplyPopover from "./ReplyPopover";
import { Box, Button, Popover, Tooltip, Typography } from "@mui/material";
import { getLatestMessageTime } from "../services/helper";
import EmojiPicker from "emoji-picker-react";
import api from "../services/api";
import { PlusOne } from "@mui/icons-material";

// Emoji component
const Emoji = ({ emoji, onEmojiClick }) => (
  <Button sx={{ fontSize: 30, cursor: "pointer" }} onClick={onEmojiClick}>
    {emoji}
  </Button>
);

const Message = (props) => {
  const { user } = useContext(AuthContext);
  const [usersData, setUsersData] = React.useState(null);
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

  const handleEmojiClick = (e) => {
    // add emoji to message
    let emoji = e.currentTarget.textContent;
    const newReaction = {
      message_id: props.message.id,
      user_id: user.data.id,
      reaction: emoji,
    };
    api
      .reactOnMessage(newReaction)
      .then((r) => {
        console.log("reaction added");
        setSelectedEmoji(emoji);
        setIsReacted(true);
        props.getMessageAction(Math.random());
        closeEmojiPicker();
      })
      .catch((e) => {
        console.log(e);
      });
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

    // users data
    api.getUsers().then((response) => {
      setUsersData(response.data);
    });
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
              <Box>
                <Emoji onEmojiClick={handleEmojiClick} emoji="👍" />
                <Emoji onEmojiClick={handleEmojiClick} emoji="❤️" />
                <Emoji onEmojiClick={handleEmojiClick} emoji="😂" />
                <Emoji onEmojiClick={handleEmojiClick} emoji="😮" />
                <Emoji onEmojiClick={handleEmojiClick} emoji="😢" />
                <Emoji onEmojiClick={handleEmojiClick} emoji="🙏" />
              </Box>
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
          {/* Reactions */}
          {props.message.reactions && props.message.reactions.length !== 0 ? (
            <Tooltip
              title={props.message.reactions.map((reaction, idx) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={idx}
                >
                  <Box flex={4} mx={1}>
                    {usersData &&
                      usersData.map((userData, idx) => {
                        if (userData.id === reaction.user_id) {
                          return (
                            <Typography key={idx} variant="p">
                              {userData?.name}
                            </Typography>
                          );
                        }
                      })}
                  </Box>
                  <Typography flex={1} variant="h6" mx={1}>
                    {reaction.reaction}
                  </Typography>
                </Box>
              ))}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 10,
                  bottom: -10,
                  fontSize: 14,
                  bgcolor: "#bbb",
                  padding: 1,
                  borderRadius: 15,
                }}
              >
                <PlusOne />
                <InsertEmoticonIcon color="action" />
              </Box>
            </Tooltip>
          ) : (
            <></>
          )}
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
