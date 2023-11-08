import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";

const ReplyShortcutsManager = () => {
  const { user, updateUserShortcuts } = useContext(AuthContext);
  const [replyShortcuts, setReplyShortcuts] = useState([]);

  const [editedReply, setEditedReply] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    if (user) {
      setReplyShortcuts(user.data.reply_shortcuts);
    }
  }, []);

  const handleEdit = (i) => {
    setEditIndex(i);
    const shortcutIndex = replyShortcuts.findIndex((obj => obj.id == i));
    setEditedReply(replyShortcuts[shortcutIndex].reply);
  }


  const handleSave = (e) => {
    e.preventDefault();
    updateUserShortcuts(editIndex, editedReply);
    const shortcutIndex = replyShortcuts.findIndex((obj => obj.id == editIndex));
    replyShortcuts[shortcutIndex].reply = editedReply;
    setEditIndex(-1);
    setEditedReply("");
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="reply shortcuts table">
          <TableHead>
            <TableRow>
              <TableCell>Shortcut</TableCell>
              <TableCell>Reply</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {replyShortcuts && replyShortcuts.length > 0 && replyShortcuts.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell><Typography variant="p" sx={{ bgcolor: "grey", padding: 1 }}>{shortcut.shortcut}</Typography></TableCell>
                <TableCell>
                  <TextField
                    value={editIndex === shortcut.id ? editedReply : shortcut.reply}
                    disabled={editIndex === shortcut.id ? false : true}
                    onChange={(e) => setEditedReply(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  {editIndex === shortcut.id ? (
                    <Button onClick={handleSave}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(shortcut.id)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*
      <div>
        <TextField
          label="Shortcut"
          value={editedShortcut}
          onChange={(e) => setEditedShortcut(e.target.value)}
          placeholder="Ctrl+1, Ctrl+2, ..."
        />
        <TextField
          label="Reply"
          value={editedReply}
          onChange={(e) => setEditedReply(e.target.value)}
          placeholder="Type your reply here"
        />
        <Button onClick={handleSave}>Add/Save</Button>
      </div> */}
    </div>
  );
};

export default ReplyShortcutsManager;
