import * as React from "react";
import { Box, TextField, Popover, Button } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";
import { AuthContext } from "../services/AuthContext";

export default function ReplyPopover(props) {
  const { user } = React.useContext(AuthContext);
  const [reply, setReply] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSubmit = () => {
    const newMessage = {
      chat_id: props.chatId,
      sender_id: user.data.id,
      message: reply,
      parent_message_id: props.messageId,
      type: "message"
    };
    props.sendTestMsg(newMessage);
    setReply("");
    props.scroll.current.scrollIntoView({ behavior: "smooth" });
    setAnchorEl(null);
  };

  React.useEffect(() => {
    function getFocusedInput(m) {
      const focusedElement = document.activeElement;
      if (focusedElement.tagName === 'INPUT') {
        setReply(m);
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
    <div style={props.style}>
      <Button aria-describedby={id} variant="text" onClick={handleClick}>
        Reply
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Box sx={{ width: "100%", display: "flex" }}>
            {/* <Box
              sx={{
                bgcolor: "#ddd",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                m: 1,
                flex: 3,
              }}
            >
              <InputEmoji
                value={reply}
                onChange={messageHandler}
                className="form-input__input"
                placeholder="type reply..."
                id="replyInput"
                name="replyInput"
                keepOpened
                onEnter={onEnter}
              />
            </Box> */}
            <TextField
              sx={{ flex: 4, mx: 1 }}
              label="type reply...."
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              margin="normal"
              required
              className="form-input__input"
              placeholder="type reply..."
              id="replyInput"
              name="replyInput"
            />

            <Button
              disabled={!reply || reply === "" ? true : false}
              type="submit"
              variant="contained"
              endIcon={<SendOutlined />}
              color="info"
              sx={{ flex: 1, m: 1, height: "56px", mt: 2 }}
            >
              Reply
            </Button>
          </Box>
        </form>
      </Popover>
    </div>
  );
}
