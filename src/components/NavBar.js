import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Edit, Group, Message, People, Settings } from "@mui/icons-material";
import { FullModal } from "./Modal";
import avatar_img from "../assets/img/user.png";
import logoImg from "../assets/img/collaborate.png";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";
import UserManagement from "./UserManagement";

const NavBar = (props) => {
  const { user } = useContext(AuthContext);
  // Modals and toggle
  const [open, setOpen] = React.useState(false);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const openProfileModal = () => {
    setProfileModalOpen(true);
  };
  const handleClickToggle = () => {
    setOpen(!open);
  };

  // Log Out
  const signOut = () => {
    api.logout();
    window.location.reload();
  };

  // Get Page
  const getPageOnClick = (e) => {
    props.getPage(e.target.textContent);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={
          !user.data.image_url || user.data.image_url === ""
            ? avatar_img
            : user.data.image_url
        }
        alt="User Avatar"
        width={150}
        style={{ marginTop: 50 }}
      />
      <Typography variant="h6" mb={1} mt={1}>
        {user.data.name} {user.data.image_url}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        sx={{ marginBottom: 5, paddingTop: "6px" }}
        color="secondary"
        onClick={signOut}
      >
        Log Out
      </Button>

      <List
        sx={{
          width: "80%",
          maxWidth: 360,
          bgcolor: "transparent",
          color: "white",
        }}
        component="nav"
      >
        <ListItemButton onClick={getPageOnClick}>
          <ListItemIcon>
            <Message sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={18}>Messages</Typography>
          </ListItemText>
        </ListItemButton>
        <br />
        <ListItemButton onClick={getPageOnClick}>
          <ListItemIcon>
            <Group sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={18}>Groups</Typography>
          </ListItemText>
        </ListItemButton>
        <br />
        <ListItemButton onClick={getPageOnClick}>
          <ListItemIcon>
            <People sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={18}>Users</Typography>
          </ListItemText>
        </ListItemButton>
        <br />
        <ListItemButton onClick={handleClickToggle}>
          <ListItemIcon>
            <Settings sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={18}>Settings</Typography>
          </ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 5 }} onClick={openProfileModal}>
              <ListItemIcon>
                <Edit sx={{ color: "white" }} fontSize="medium" />
              </ListItemIcon>
              <ListItemText>
                <Typography fontSize={18}>Edit</Typography>
              </ListItemText>
            </ListItemButton>
            <FullModal
              open={profileModalOpen}
              modalTitle={"Manage Users"}
              updateOpenValue={setProfileModalOpen}
              ModalContent={UserManagement}
            />
          </List>
        </Collapse>
      </List>

      <Box position={"absolute"} bottom={15}>
        <img
          src={logoImg}
          alt="collaborate"
          width={50}
          style={{ marginBottom: 10 }}
        />
        <Typography variant="h6" fontWeight={700}>
          Partners Chat
        </Typography>
      </Box>
    </Box>
  );
};

export default NavBar;