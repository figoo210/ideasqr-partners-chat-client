import * as React from "react";
import { Alert, Snackbar } from "@mui/material";

export function Notification({ open, handleClose, msg }) {

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        {msg || "New Message."}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
