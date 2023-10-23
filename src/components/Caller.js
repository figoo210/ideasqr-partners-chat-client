import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Assets from "../assets/data";
const Caller = ({ open, callerUser, onAnswer, onDecline }) => {
  useEffect(() => {
    const audioElement = document.getElementById("ringing-audio");

    if (audioElement) {
      if (open) {
        // Start playing the audio when the component is open
        audioElement.play();
      } else {
        // Pause the audio when the component is closed
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      BackdropProps={{
        style: { backdropFilter: "blur(3px)" }, // Customize backdrop here
        onClick: () => {}, // Prevent clicking on the backdrop
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: (theme) => theme.spacing(2),
        }}
      >
        {/* <iframe
          src="https://giphy.com/embed/AKpstKOvXWH4xWMRWJ"
          width="398"
          height="480"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe> */}
        <img
          src={Assets.phoneCall} // Replace with the path to your animated phone icon
          alt="Phone Icon"
          width={80}
          height={80}
        />
        <Typography color="black" variant="h6">
          Incoming call from {callerUser?.name}
        </Typography>
        <Box
          sx={{
            marginTop: (theme) => theme.spacing(2),
            display: "flex",
            gap: (theme) => theme.spacing(2),
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            startIcon={<VideoCallIcon />}
            variant="contained"
            color="success"
            onClick={onAnswer}
          >
            Answer
          </Button>
          <Button
            startIcon={<CallEndIcon />}
            variant="contained"
            color="error"
            onClick={onDecline}
          >
            Decline
          </Button>
        </Box>
        <audio id="ringing-audio" autoPlay loop>
          <source src={Assets.alertSound} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </DialogContent>
    </Dialog>
  );
};

export default Caller;
