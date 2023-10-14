import React, { useEffect, useState } from "react";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  Box,
} from "@mui/material";
import api from "../services/api";
import { AddNewPermissionForm, AddNewRoleForm } from "./Forms";

const ROLES = [
  {
    role: "Admin",
    permissions: [
      { permission: "create" },
      { permission: "read" },
      { permission: "update" },
    ],
  },
  {
    role: "Manager",
    permissions: [{ permission: "create" }, { permission: "read" }],
  },
  // Other roles...
];

const PERMISSIONS = [
  { permission: "create" },
  { permission: "read" },
  { permission: "update" },
  { permission: "delete" },
  // Other permissions...
];

const RolesPermissionsManager = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [editingRole, setEditingRole] = useState(null);
  const [editedPermissions, setEditedPermissions] = useState({});

  useEffect(() => {
    // Get Roles
    api
      .getRoles()
      .then((response) => {
        let data = response.data;
        setRoles(data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    // Get Permissions
    api
      .getPermissions()
      .then((response) => {
        let data = response.data;
        setPermissions(data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  const getNewRoles = (role) => {
    setRoles([...roles, role]);
  };

  const handleEditClick = (role) => {
    setEditingRole(role);
    setEditedPermissions({
      ...editedPermissions,
      [role]:
        roles
          .find((r) => r.role === role)
          ?.permissions.map((p) => p?.permission) ?? [],
    });
  };

  const handlePermissionChange = (permission, isChecked) => {
    setEditedPermissions({
      ...editedPermissions,
      [editingRole]: isChecked
        ? [...editedPermissions[editingRole], permission]
        : editedPermissions[editingRole].filter((p) => p !== permission),
    });
  };

  const handleSaveClick = () => {
    // Send editedPermissions to the server or update state as desired
    console.log(editedPermissions);
    Object.keys(editedPermissions).forEach((key) => {
      const newRP = {
        role: key,
        permissions: editedPermissions[key]
      }
      console.log(newRP);
      api.newRolePermission(newRP).then((resp) => {
        console.log(resp.data);
        setRoles(resp.data);

      }).catch((err) => {
        console.log(err);
      })
    });
    setEditingRole(null);
    setEditedPermissions({});
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              {permissions.map((permission) => (
                <TableCell key={permission.permission}>
                  {permission.permission}
                </TableCell>
              ))}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.role}>
                <TableCell>{role.role}</TableCell>
                {permissions.map((permission) => (
                  <TableCell key={permission.permission}>
                    {editingRole === role.role ? (
                      <Checkbox
                        checked={
                          editedPermissions[role.role]?.includes(
                            permission.permission
                          ) || false
                        }
                        onChange={(event) =>
                          handlePermissionChange(
                            permission.permission,
                            event.target.checked
                          )
                        }
                      />
                    ) : (
                      <Checkbox
                        checked={role?.permissions.some(
                          (p) => p.permission === permission.permission
                        )}
                        disabled
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell align="right">
                  {editingRole === role.role ? (
                    <IconButton onClick={handleSaveClick}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditClick(role.role)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          alignItems: "center",
          padding: 5,
        }}
      >
        <AddNewRoleForm getNewRoles={getNewRoles} />
      </Box>
    </Box>
  );
};

export default RolesPermissionsManager;
