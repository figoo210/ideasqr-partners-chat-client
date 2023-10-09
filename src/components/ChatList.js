import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Assets from "../assets/data";
import {
  getLatestMessage,
  getLatestMessageTime,
  getOtherChatUserId,
} from "../services/helper";
import { Box, ListItemButton } from "@mui/material";
import { AuthContext } from "../services/AuthContext";

export default function ChatList(props) {
  const { user } = React.useContext(AuthContext);

  const getChatName = (chat) => {
    if (!chat.is_group && props.usersData) {
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
    props.getChat(e.currentTarget.id);
  };

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "transparent",
        overflow: "auto",
        maxHeight: "70vh",
      }}
    >
      {props.data &&
        props?.data?.length > 0 &&
        props.data.map((d, idx) => {
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
                secondary={d.messages ? getLatestMessage(d.messages) : ""}
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
                {/* <PlusOneRounded sx={{ color: "white", backgroundColor: "green" }} /> */}
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
