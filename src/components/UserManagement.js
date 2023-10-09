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
} from "@mui/material";
import api from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    image_url: "",
    role_name: "",
  });

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
  }, []);

  const handleDelete = async (id) => {
    await api.deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <TableContainer component={Paper}>
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
            {users.map((user) => (
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
            <TextField
              label="Role"
              name="role_name"
              value={formValues.role_name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
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
