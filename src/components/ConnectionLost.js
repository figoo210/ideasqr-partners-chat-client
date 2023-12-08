import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Assets from "../assets/data";


const ConnectionLost = ({ open }) => {

  return (
    <Dialog
      open={open}
      BackdropProps={{
        style: { backdropFilter: "blur(5px)" }, // Customize backdrop here
        onClick: () => { }, // Prevent clicking on the backdrop
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: (theme) => theme.spacing(4),
        }}
      >
        <img
          src={Assets.noInternet} // Replace with the path to your animated phone icon
          alt="Phone Icon"
          width={100}
          height={100}
        />
        <Typography color="black" variant="h6">
          Connection Lost
        </Typography>
        <Box
          sx={{
            marginTop: (theme) => theme.spacing(2),
            display: "flex",
            gap: (theme) => theme.spacing(2),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reconnect
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionLost;
