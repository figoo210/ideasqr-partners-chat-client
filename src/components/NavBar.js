import React, { useContext } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HubIcon from "@mui/icons-material/Hub";
import CachedIcon from '@mui/icons-material/Cached';
import InfoIcon from '@mui/icons-material/Info';

import {
  Edit,
  Group,
  Message,
  People,
  Settings,
  LockOpen,
  Person,
  ShortcutOutlined,
} from "@mui/icons-material";
import { FullModal } from "./Modal";
import avatar_img from "../assets/img/user.png";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";
import UserManagement from "./UserManagement";
import RolesPermissionsManager from "./RolesPermissionsManager";
import IPGroupManager from "./IPGroups";
import ProfileManagement from "./ProfileManagement";
import ReplyShortcutsManager from "./ReplyShortcutsManager";

const NavBar = (props) => {
  const { user } = useContext(AuthContext);
  // Modals and toggle
  const [open, setOpen] = React.useState(false);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = React.useState(false);
  const [usersModalOpen, setUsersModalOpen] = React.useState(false);
  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [ipModalOpen, setIpModalOpen] = React.useState(false);

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const openShortcutsModal = () => {
    setShortcutsModalOpen(true);
  };

  const openUsersModal = () => {
    setUsersModalOpen(true);
  };

  const openRoleModal = () => {
    setRoleModalOpen(true);
  };

  const openIpModal = () => {
    setIpModalOpen(true);
  };

  const handleClickToggle = () => {
    setOpen(!open);
  };

  const reloadPage = () => {
    window.location.reload();
  }

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
        width={100}
        style={{ marginTop: 5 }}
      />
      <Typography variant="h6" mb={1} mt={1}>
        {user.data.name} {user.data.image_url}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ marginBottom: 2, paddingTop: "5px" }}
          color="secondary"
          onClick={signOut}
        >
          Log Out
        </Button>
        <Tooltip title="Reload the app" arrow>
          <span onClick={reloadPage} ><CachedIcon sx={{ ml: 1, mt: 0.6, color: "white", cursor: "pointer" }} /></span>
        </Tooltip>
        <Tooltip title={"Message can be edited by double click on it."} placement="right" arrow>
          <InfoIcon sx={{ ml: 1, mt: 0.6, color: "white", cursor: "pointer" }} />
        </Tooltip>
      </Box>
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
            <Typography fontSize={16}>Messages</Typography>
          </ListItemText>
        </ListItemButton>

        <ListItemButton onClick={getPageOnClick}>
          <ListItemIcon>
            <Group sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={16}>Groups</Typography>
          </ListItemText>
        </ListItemButton>

        <ListItemButton onClick={getPageOnClick}>
          <ListItemIcon>
            <People sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={16}>Contact List</Typography>
          </ListItemText>
        </ListItemButton>

        <ListItemButton onClick={handleClickToggle}>
          <ListItemIcon>
            <Settings sx={{ color: "white" }} fontSize="medium" />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={16}>Settings</Typography>
          </ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 5 }} onClick={openProfileModal}>
              <ListItemIcon>
                <Person sx={{ color: "white" }} fontSize="medium" />
              </ListItemIcon>
              <ListItemText>
                <Typography fontSize={16}>Profile</Typography>
              </ListItemText>
            </ListItemButton>
            <FullModal
              open={profileModalOpen}
              modalTitle={"User Profile"}
              updateOpenValue={setProfileModalOpen}
              ModalContent={ProfileManagement}
            />

            <ListItemButton sx={{ pl: 5 }} onClick={openShortcutsModal}>
              <ListItemIcon>
                <ShortcutOutlined sx={{ color: "white" }} fontSize="medium" />
              </ListItemIcon>
              <ListItemText>
                <Typography fontSize={16}>Shortcuts</Typography>
              </ListItemText>
            </ListItemButton>
            <FullModal
              open={shortcutsModalOpen}
              modalTitle={"Reply Shortcuts"}
              updateOpenValue={setShortcutsModalOpen}
              ModalContent={ReplyShortcutsManager}
            />

            {user.role.permissions.some(
              (perm) => perm.permission === "edit users"
            ) && (
                <>
                  <ListItemButton sx={{ pl: 5 }} onClick={openUsersModal}>
                    <ListItemIcon>
                      <Edit sx={{ color: "white" }} fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontSize={16}>Users</Typography>
                    </ListItemText>
                  </ListItemButton>
                  <FullModal
                    open={usersModalOpen}
                    modalTitle={"Manage Users"}
                    updateOpenValue={setUsersModalOpen}
                    ModalContent={UserManagement}
                  />
                </>
              )}

            {user.role.permissions.some(
              (perm) => perm.permission === "edit roles"
            ) && (
                <>
                  <ListItemButton sx={{ pl: 5 }} onClick={openRoleModal}>
                    <ListItemIcon>
                      <LockOpen sx={{ color: "white" }} fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontSize={16}>Roles</Typography>
                    </ListItemText>
                  </ListItemButton>
                  <FullModal
                    open={roleModalOpen}
                    modalTitle={"Roles & Permissions"}
                    updateOpenValue={setRoleModalOpen}
                    ModalContent={RolesPermissionsManager}
                  />
                </>
              )}

            {user.role.permissions.some(
              (perm) => perm.permission === "edit ip groups"
            ) && (
                <>
                  <ListItemButton sx={{ pl: 5 }} onClick={openIpModal}>
                    <ListItemIcon>
                      <HubIcon sx={{ color: "white" }} fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontSize={16}>IP Groups</Typography>
                    </ListItemText>
                  </ListItemButton>
                  <FullModal
                    open={ipModalOpen}
                    modalTitle={"IP Groups"}
                    updateOpenValue={setIpModalOpen}
                    ModalContent={IPGroupManager}
                  />
                </>
              )}
          </List>
        </Collapse>
      </List>

      {/* <Box position={"absolute"} bottom={15}>
        <img
          src={logoImg}
          alt="collaborate"
          width={50}
          style={{ marginBottom: 10 }}
        />
        <Typography variant="h6" fontWeight={700}>
          Partners Chat
        </Typography>
      </Box> */}
    </Box>
  );
};

export default NavBar;
