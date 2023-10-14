import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const IPGroupManager = () => {
  const [ipGroups, setIPGroups] = useState([]);
  const [ip, setIP] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIPGroup, setSelectedIPGroup] = useState(null);

  useEffect(() => {
    // Fetch IPGroups from the server
    fetchIPGroups();
  }, []);

  const fetchIPGroups = async () => {
    try {
      const response = await axios.get("/api/ip-groups");
      setIPGroups(response.data);
    } catch (error) {
      console.error("Error fetching IPGroups:", error);
    }
  };

  const handleAddIPGroup = async () => {
    try {
      await axios.post("/api/ip-groups", { ip, name, users });
      fetchIPGroups();
      setIP("");
      setName("");
      setUsers([]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding IPGroup:", error);
    }
  };

  const handleUpdateIPGroup = async () => {
    try {
      await axios.put(`/api/ip-groups/${selectedIPGroup.ip}`, { name, users });
      fetchIPGroups();
      setName("");
      setUsers([]);
      setSelectedIPGroup(null);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating IPGroup:", error);
    }
  };

  const handleEditClick = (ipGroup) => {
    setSelectedIPGroup(ipGroup);
    setName(ipGroup.name);
    setUsers(ipGroup.users);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (ip) => {
    try {
      await axios.delete(`/api/ip-groups/${ip}`);
      fetchIPGroups();
    } catch (error) {
      console.error("Error deleting IPGroup:", error);
    }
  };

  const handleUserChange = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index] = value;
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    setUsers((prevUsers) => [...prevUsers, ""]);
  };

  const handleRemoveUser = (index) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedIPGroup ? "Edit IP Group" : "Add IP Group"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="IP"
            value={ip}
            onChange={(e) => setIP(e.target.value)}
            fullWidth
            disabled={selectedIPGroup !== null}
            sx={{ my: 1 }}
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ my: 1 }}
          />
          <h3 style={{ marginTop: 3 }}>Users</h3>
          {users.map((user, index) => (
            <div key={index}>
              <TextField
                label="User"
                value={user}
                onChange={(e) => handleUserChange(index, e.target.value)}
                fullWidth
                sx={{ my: 1 }}
              />
              <Button sx={{ my: 1 }} onClick={() => handleRemoveUser(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button sx={{ my: 1 }} onClick={handleAddUser}>
            Add User
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedIPGroup ? handleUpdateIPGroup : handleAddIPGroup}
            color="primary"
          >
            {selectedIPGroup ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ipGroups.map((ipGroup) => (
              <TableRow key={ipGroup.ip}>
                <TableCell>{ipGroup.ip}</TableCell>
                <TableCell>{ipGroup.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(ipGroup)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(ipGroup.ip)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        sx={{ m: 3 }}
        variant="contained"
        onClick={() => setOpenDialog(true)}
      >
        Add IP Group
      </Button>
    </div>
  );
};

export default IPGroupManager;
