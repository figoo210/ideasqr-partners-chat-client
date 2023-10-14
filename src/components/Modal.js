import * as React from "react";
import Dialog from "@mui/material/Dialog";
import {
  AppBar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomModal(props) {
  const handleClose = () => {
    props.updateOpenValue(false);
  };

  return (
    <div>
      <Dialog maxWidth="lg" open={props.open} onClose={handleClose}>
        <DialogTitle>{props.modalTitle}</DialogTitle>
        <DialogContent>
          {/* Modal Content */}
          {props.ModalContent ? (
            <props.ModalContent closeModal={handleClose} />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const FullModal = (props) => {
  const handleClose = () => {
    props.updateOpenValue(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.modalTitle}
            </Typography>

            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {props.ModalContent ? <props.ModalContent /> : ""}
      </Dialog>
    </div>
  );
};
