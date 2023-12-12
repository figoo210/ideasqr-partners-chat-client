import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Assets from "../assets/data";
import {
  getLatestMessage,
  getLatestMessageNotification,
  getLatestMessageTime,
  getOtherChatUserId,
  shortenString,
} from "../services/helper";
import { Box, ListItemButton } from "@mui/material";
import { AuthContext } from "../services/AuthContext";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import api from "../services/api";

export default function ChatList(props) {
  const { user } = React.useContext(AuthContext);

  // State variable to hold the sorted chat list
  const [sortedChats, setSortedChats] = React.useState([]);

  // Function to sort chats based on the last message
  const sortChats = (d) => {
    let sorted = [...props.data];
    if (d) {
      sorted = d;
    }
    sorted.sort((a, b) => {
      const aLastMessage = a.messages ? a.messages.sort((m, n) => new Date(m.created_at) - new Date(n.created_at))[a.messages.length - 1] : null;
      const bLastMessage = b.messages ? b.messages.sort((k, l) => new Date(k.created_at) - new Date(l.created_at))[b.messages.length - 1] : null;

      if (!aLastMessage) return 1; // Put chats with no messages at the end
      if (!bLastMessage) return -1;

      // Convert timestamp strings to Date objects
      const aTimestamp = new Date(aLastMessage.created_at);
      const bTimestamp = new Date(bLastMessage.created_at);

      // Compare the timestamps of the last messages
      return bTimestamp - aTimestamp;
    });

    setSortedChats(sorted);
  };

  // Use useEffect to sort the chats when the component mounts or whenever props.data changes
  React.useEffect(() => {
    if (props.data) {
      sortChats();
    }
  }, [props.data, props.searchField, props.updateChatNotification]);

  const getChatName = (chat) => {
    if (!chat.is_group && props.usersData && chat.chat_name) {
      for (let i = 0; i < props.usersData.length; i++) {
        const u = props.usersData[i];
        if (u.id === getOtherChatUserId(chat.chat_name, user.data.id)) {
          return u.name;
        }
      }
    } else {
      return chat.chat_name;
    }
  };

  const getClicked = (e) => {
    sortChats();
    props.getChat(e.currentTarget.id);
    for (let i = 0; i < props?.data.length; i++) {
      const element = props?.data[i];
      if (element.chat_name === e.currentTarget.id) {
        for (let j = 0; j < element.messages.length; j++) {
          const msg = element.messages[j];
          if (!msg.seen && user.data.id !== msg.sender_id) {
            api.messageSeen(msg.id);
            props.data[i].messages[j].seen = true;
          }
        }
      }
    }
  };

  const filteredChats = sortChats && sortedChats.length > 0 && sortedChats.filter((chat) => {
    if (props.searchField && props.searchField.length > 0 && getChatName(chat)) {
      return getChatName(chat).toLowerCase().includes(props.searchField.toLowerCase());
    } else {
      return true;
    }
  });

  // React.useEffect(() => {
  //   if (props.updateChatNotification) {
  //     if (sortedChats && sortedChats.length > 0) {
  //       console.log("here ---------");
  //       let d = sortedChats;
  //       let chatIndex = d.findIndex(obj => obj.chat_name === props.updateChatNotification.chat_id);
  //       if (chatIndex !== -1) {
  //         d[chatIndex].messages.push(props.updateChatNotification);
  //         console.log(d);
  //         sortChats(d);
  //       }
  //     }
  //   }
  // }, [props.updateChatNotification]);

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "transparent",
        overflow: "auto",
        maxHeight: "70vh",
      }}
    >
      {filteredChats &&
        filteredChats.length > 0 &&
        filteredChats.map((d, idx) => {
          if (
            d.is_group &&
            !d.chat_members?.some((item) => item.user_id === user.data.id)
          ) {
            return <div key={idx}></div>;
          }
          if (
            !d.is_group &&
            d?.chat_name &&
            !d?.chat_name.split("-").includes(user.data.id.toString())
          ) {
            return <div key={idx}></div>;
          }
          return (
            <ListItemButton
              alignItems="flex-start"
              sx={{ bgcolor: "transparent", borderBottom: "1px solid" }}
              key={idx}
              id={d.chat_name}
              onClick={getClicked}
            >
              <ListItemAvatar>
                <Avatar
                  alt="Avatar Image"
                  src={d.image_url ? d.image_url : Assets.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={getChatName(d)}
                secondary={
                  d.messages ? shortenString(props.updateChatNotification?.chat_id === d?.chat_name && props.updateChatNotification?.message
                    || getLatestMessage(d.messages), 20) : ""
                }
              />
              <Box
                mt={1}
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {d?.messages &&
                  getLatestMessageNotification(d.messages, user.data.id) && (
                    <NotificationsActiveIcon
                      sx={{ color: "white", backgroundColor: "green" }}
                    />
                  )}
                <Typography
                  variant="body2"
                  color={"grey"}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  {d.messages ? getLatestMessageTime(d.messages) : ""}
                </Typography>
              </Box>
            </ListItemButton>
          );
        })}
    </List>
  );
}
