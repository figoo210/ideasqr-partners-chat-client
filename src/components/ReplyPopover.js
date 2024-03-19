import * as React from "react";
import { Box, TextField, Popover, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";
import { AuthContext } from "../services/AuthContext";

export default function ReplyPopover(props) {
  const { user } = React.useContext(AuthContext);
  const [reply, setReply] = React.useState("");
  const [msgID, setMsgID] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [msgSender, setMsgSender] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log(props.messageId);
    setMsgID(props.messageId);
    setMsg(props.message);
    setMsgSender(props.sender);
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
      parent_message_id: msgID,
      type: "message"
    };
    props.sendTestMsg(newMessage);
    setReply("");
    props.scroll.current.scrollIntoView({ behavior: "smooth" });
    setAnchorEl(null);
  };

  // Shortcuts handling
  React.useEffect(() => {
    function getFocusedInput(m) {
      const focusedElement = document.activeElement;
      if (focusedElement.tagName === 'INPUT') {
        if (focusedElement.value.length > 0) {
          setReply(focusedElement.value + " " + m);
        } else {
          setReply(m);
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
    <div style={props.style}>
      <Button aria-describedby={id} variant="text" onClick={handleClick}>
        Reply
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reply</DialogTitle>
        <DialogContent>
          <p style={{ marginRight: 8, marginLeft: 8 }}>{msgSender}</p>
          <p style={{ marginRight: 8, marginLeft: 8, marginTop: 3, marginBottom: 5, color: "gray" }}>{msg}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Box sx={{ width: "100%", display: "flex" }}>
              <TextField
                sx={{ flex: 5, mx: 1 }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
