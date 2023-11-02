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
import { shortenFileName, shortenString } from "../services/helper";
import { FilePresentOutlined, PlusOne } from "@mui/icons-material";
import MessageAction from "./MessageAction";


const Message = (props) => {
  const { user } = useContext(AuthContext);
  const [messageTime, setMessageTime] = useState("hh:mm PM \n Mon d, yyyy");
  const [reactions, setReactions] = useState([]);
  const [isReply, setIsReply] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const formatTime = (t) => {
    const localTime = new Date(t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const localDate = new Date(t).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${localTime}\n${localDate}`;
  }

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
      props?.message?.parent_message_id > 0
    ) {
      setIsReply(true);
    } else setIsReply(false);
  }, [props.message]);

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
    if (reactions) {
      setReactions([...reactions, r]);
    } else {
      setReactions([r]);
    }

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
              {displayMessage(props.message.message || "")}
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
                      {reaction?.created_at ? formatTime(reaction?.created_at) : formatTime(Date.now())}
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
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
