import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    image_url: "",
    role_name: "",
  });

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = (user) => {
    setSelectedUser(user);
    setFormValues({
      name: user.name,
      email: user.email,
      password: "",
      image_url: user.image_url,
      role_name: user.role_name,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await api.updateUser(selectedUser.id, formValues);
    const updatedUser = await response.data;
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    handleClose();
  };

  useEffect(() => {
    api.getUsers().then((response) => {
      setUsers(response.data);
    });
    // Get Roles
    api
      .getRoles()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  const handleDelete = async (id) => {
    await api.deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users && users.length > 0 && users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <TextField
          label="Search by Name or Email ...."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "90%", margin: "auto", mt: 2, position: "absolute", left: 0, right: 0 }}
        />
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers && filteredUsers.length > 0 && filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role_name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                  <Button onClick={() => handleDelete(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              type="password"
              required={!selectedUser.id}
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={formValues.image_url}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <FormControl margin="normal" sx={{ flex: 1, mx: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValues.role_name}
                label="Role"
                name="role_name"
                required
                onChange={handleFormChange}
              >
                {roles && roles.map((r, idx) => (
                  <MenuItem selected={formValues.role_name === r.role ? true : false} key={idx} value={r.role}>{r.role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
