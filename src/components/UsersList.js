import * as React from "react";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Assets from "../assets/data";
import { ListItemButton } from "@mui/material";
import { AuthContext } from "../services/AuthContext";

export default function UsersList(props) {
  const { user } = React.useContext(AuthContext);

  const getClicked = (e) => {
    let chatIds = [parseInt(e.currentTarget.id), user.data.id];
    chatIds.sort((a, b) => a - b);
    props.getChat(`chat-${chatIds[0]}-${chatIds[1]}`);
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
        props.data.map((d, idx) => {
          if (user.data.id !== d.id) {
            return (
              <ListItemButton
                alignItems="flex-start"
                sx={{ bgcolor: "transparent", borderBottom: "1px solid" }}
                key={idx}
                id={d.id}
                onClick={getClicked}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Avatar Image"
                    src={d.image_url ? d.image_url : Assets.avatar}
                  />
                </ListItemAvatar>
                <Typography variant="h6" mt={2} fontSize={22}>
                  {d.name}
                </Typography>
              </ListItemButton>
            );
          }
          return <span key={idx}></span>;
        })}
    </List>
  );
}
