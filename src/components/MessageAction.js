import { Box, Button, Popover, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ReplyPopover from './ReplyPopover';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';


// Emoji component
const Emoji = ({ emoji, onEmojiClick }) => (
  <Button sx={{ fontSize: 30, cursor: "pointer" }} onClick={onEmojiClick}>
    {emoji}
  </Button>
);

function MessageAction(props) {
  const { user } = useContext(AuthContext);
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
      message: props.message.message,
    };
    props.sendTestMsg({ reaction: newReaction, message_id: props.message.id, chat_id: props.chatId });
    api
      .reactOnMessage(newReaction)
      .then((r) => {
        console.log("reaction added");
      })
      .catch((e) => {
        console.log(e);
      });
    props.updateLiveReaction({
      message_id: props.message.id,
      user_id: user.data.id,
      reaction: emoji,
      message: props.message.message,
    });
    setSelectedEmoji(emoji);
    setIsReacted(true);
    closeEmojiPicker();
  };

  return (
    <Box
      sx={user.data.id === props.message.sender_id ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        position: "absolute",
        left: -120,
        top: 0,
        bottom: 0,
      } : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        position: "absolute",
        right: -120,
        top: 0,
        bottom: 0,
        direction: "rtl",
      }}
      className="chat-bubble__actions"
    >
      <ReplyPopover
        style={{ flex: 1 }}
        chatId={props.chatId}
        messageId={props.message.id}
        sendTestMsg={props.sendTestMsg}
        scroll={props.scroll}
      />
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
    </Box>
  )
}

export default MessageAction