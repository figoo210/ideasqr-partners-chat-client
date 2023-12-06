import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';

function EditMessage(props) {
    const [updatedMessage, setUpdatedMessage] = useState('');

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleSave = () => {
        if (updatedMessage && updatedMessage.trim().length > 0 && updatedMessage.trim() !== props.message.message) {
            console.log("Edited!!");
            props.getEditedMessage(updatedMessage.trim());
            props.setOpen(false);
            let editedMessage = {
                ...props.message,
                message: updatedMessage.trim(),
                type: "edit"
            }
            api.updateMessage(props.message.id, editedMessage);
            props.sendTestMsg(editedMessage);
        }
    };

    useEffect(() => {
        if (props.message) {
            setUpdatedMessage(props.message.message);
        }
    }, [props.message])

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose}>
                <DialogTitle>Edit Message</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        value={updatedMessage}
                        onChange={(e) => setUpdatedMessage(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditMessage;
