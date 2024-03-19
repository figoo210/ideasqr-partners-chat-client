import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../services/AuthContext";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import avatar_img from "../assets/img/user.png";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { shortenFileName, shortenString, updateUserLiveReactions } from "../services/helper";
import { FilePresentOutlined, PlusOne } from "@mui/icons-material";
import MessageAction from "./MessageAction";
import EditMessage from "./EditMessage";
const { DateTime } = require('luxon');


const Message = (props) => {
  const { user } = useContext(AuthContext);
  const [messageTime, setMessageTime] = useState("hh:mm PM \n Mon d, yyyy");
  const [reactions, setReactions] = useState([]);
  const [isReply, setIsReply] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedMessage, setEditedMessage] = useState(null);

  const formatTime = (t) => {
    let dateTime;

    // Check if t is a string or timestamp
    if (typeof t === 'string') {
      // Parse the input string using Luxon's fromISO method with offset support
      dateTime = DateTime.fromISO(t, { zone: 'Africa/Cairo' });
    } else if (typeof t === 'number') {
      // Convert timestamp to DateTime object
      dateTime = DateTime.fromMillis(t, { zone: 'Africa/Cairo' });
    } else {
      throw new Error('Invalid input type. Expected string or timestamp.');
    }

    // Format the time
    const formattedTime = dateTime.toLocaleString({
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Format the date
    const formattedDate = dateTime.toLocaleString({
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    // Combine the formatted time and date
    return `${formattedTime}\n${formattedDate}`;
  };

  useEffect(() => {
    if (props?.message) {
      // Message Time
      setMessageTime(formatTime(props?.message.created_at));

      // Message Reactions
      setReactions(props?.message.reactions);

    }
    // scroll to the bottom of the messages wrapper div
    const messagesWrapper = document.querySelector(".messages-wrapper");
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;

    if (
      props?.message?.parent_message_id &&
      props?.message?.parent_message_id.length > 1
    ) {
      setIsReply(true);
    } else setIsReply(false);
  }, [props.message]);


  useEffect(() => {
    if (props?.message) {
      // Message Reactions
      setReactions(props?.message.reactions);
    }
  }, [props?.message.reactions]);

  const displayMessage = (msg) => {
    if (msg.includes("https://") || msg.includes("http://")) {
      if (
        msg.includes(".png") ||
        msg.includes(".jpeg") ||
        msg.includes(".jpg")
      ) {
        return (
          <IconButton
            onClick={() => {
              // Create a temporary link element
              const link = document.createElement("a");
              link.href = msg;
              link.target = "_blank";

              // Simulate a click to trigger the download
              link.click();
            }}
            sx={{
              // Set cursor to pointer
              cursor: 'pointer',
              // Reset other styles to their initial values
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              color: 'inherit',
            }}
          >
            <img alt="message media" width={300} src={msg} />
          </IconButton>
        );
      } else {
        return (
          <IconButton
            onClick={() => {
              // Create a temporary link element
              const link = document.createElement("a");
              link.href = msg;
              link.target = "_blank";

              // Simulate a click to trigger the download
              link.click();
            }}
            aria-label="Download"
          >
            <FilePresentOutlined sx={{ fontSize: 40 }} />
            {shortenFileName(msg.substring(msg.lastIndexOf("%2F") + 3, msg.lastIndexOf("?")), 10)}
          </IconButton>
        );
      }
    } else {
      return msg;
    }
  };

  const displayReplyMessage = (msg) => {
    if (msg.includes("https://") || msg.includes("http://")) {
      if (
        msg.includes(".png") ||
        msg.includes(".jpeg") ||
        msg.includes(".jpg")
      ) {
        return (
          <IconButton
            onClick={() => {
              // Create a temporary link element
              const link = document.createElement("a");
              link.href = msg;

              // Simulate a click to trigger the download
              link.click();
            }}
            aria-label="Download"
          >
            <img alt="message media" width={300} src={msg} />
          </IconButton>
        );
      } else {
        return (
          <IconButton
            onClick={() => {
              // Create a temporary link element
              const link = document.createElement("a");
              link.href = msg;

              // Simulate a click to trigger the download
              link.click();
            }}
            aria-label="Download"
          >
            <FilePresentOutlined sx={{ fontSize: 40 }} />
            {shortenFileName(msg.substring(msg.lastIndexOf("%2F") + 3, msg.lastIndexOf("?")), 10)}
          </IconButton>
        );
      }
    } else {
      return shortenString(msg, 50);
    }
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const updateLiveReaction = (r) => {
    setReactions(updateUserLiveReactions(reactions, r));
  }

  const handleDoubleClick = () => {
    if (props.message.sender_id === user.data.id) {
      setEditModalOpen(true);
    }
  };

  const getEditedMessage = (m) => {
    setEditedMessage(m);
  }
  if (!props.message) return;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
      }}
      id={props.message.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      <Box
        className={`chat-bubble ${props.message.sender_id === user.data.id ? "right" : ""
          }`}
      >
        <Box
          sx={{ direction: "ltr", display: "flex", alignItems: "flex-start" }}
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
              {props.usersData &&
                props.usersData.find((u) => u.id === props.message.sender_id)
                  ?.name}
            </Typography>
            {isReply && (
              <Box className="chat-bubble-reply">
                <Typography variant="p">
                  <Button
                    sx={{
                      position: "relative",
                      borderRadius: "0",
                      fontSize: 12,
                      backgroundColor: "transparent",
                      color: "grey",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      "&:active": {
                        backgroundColor: "transparent",
                      },
                      "&:focus": {
                        boxShadow: "none",
                      },
                    }}
                    href={"#" + props?.message.parent_message_id}
                  >
                    {props.usersData &&
                      props.messages &&
                      props.usersData.find(
                        (u) =>
                          u.id ===
                          props.messages.find(
                            (m) => m.id === props.message.parent_message_id
                          )?.sender_id
                      )?.name}
                    <br />"
                    {props.messages &&
                      displayReplyMessage(
                        props.messages.find(
                          (m) => m.id === props.message.parent_message_id
                        )?.message || ""
                      )}
                    "
                  </Button>
                </Typography>
              </Box>
            )}
            <Typography variant="p" className="user-message">
              {displayMessage(editedMessage || props.message.message || "")}
            </Typography>

            {/* Message Time */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 2,
              }}
              className="chat-bubble__actions"
            >
              <Typography
                variant="body2"
                color="grey"
                flex={1}
                textAlign={"right"}
              >
                {messageTime}
              </Typography>
            </Box>

            {/* Reactions */}

            {reactions && reactions?.length !== 0 ? (
              <Tooltip
                title={reactions.map((reaction, idx) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: 2,
                      borderBottomColor: "white",
                    }}
                    key={idx}
                  >
                    <Box flex={3} mx={1}>
                      {props.usersData &&
                        props.usersData.map((userData, idx) => {
                          if (userData.id === reaction.user_id) {
                            return (
                              <Typography key={idx} variant="body2">
                                {userData?.name}
                              </Typography>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </Box>
                    <Typography flex={2} variant="body2" mx={1}>
                      {reaction?.last_modified_at ?
                        formatTime(reaction?.last_modified_at) :
                        formatTime(DateTime.now().setZone("Africa/Cairo").toISO())
                      }
                    </Typography>
                    <Typography flex={1} variant="h6" mx={1}>
                      {reaction.reaction}
                    </Typography>
                  </Box>
                ))}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 15,
                    bottom: -15,
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

          {/* Message Actions */}

          {isHover && (
            <MessageAction
              message={props.message}
              sendTestMsg={props.sendTestMsg}
              scroll={props.scroll}
              chatId={props.chatId}
              isHover={isHover}
              updateLiveReaction={updateLiveReaction}
              sender={props.usersData && props.usersData.find((u) => u.id === props.message.sender_id)?.name}
            />
          )}
        </Box>
      </Box>

      {/* Edit Message */}
      {editModalOpen && (
        <EditMessage
          open={editModalOpen}
          setOpen={setEditModalOpen}
          message={props.message}
          getEditedMessage={getEditedMessage}
          sendTestMsg={props.sendTestMsg}
        />
      )}
    </Box>
  );
};

export default Message;
