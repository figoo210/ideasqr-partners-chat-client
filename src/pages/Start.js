import { Box, Typography } from "@mui/material";
import React from "react";

function Start() {
  return (
    <Box mt={10} padding={5}>
      <Typography variant="h3" fontWeight={700} mb={5}>
        Chat App with Video Conferencing
      </Typography>
      <Typography variant="h6" marginY={2}>
        Welcome to our chat app with video conferencing! With our app, you can
        easily connect with friends, family, and colleagues from anywhere in the
        world. Whether you need to have a quick chat or a full-blown video
        conference, our app has got you covered.
      </Typography>
      <Typography variant="h6" marginY={2}>
        Our app features a simple and intuitive interface that makes it easy to
        start a conversation or join an existing one. You can create private
        chat rooms for one-on-one conversations or group chat rooms for larger
        discussions. And with our video conferencing feature, you can have
        face-to-face conversations with multiple people at once.
      </Typography>
      <Typography variant="h6" marginY={2}>
        Our video conferencing feature is powered by the latest technology,
        ensuring that you get the best possible video and audio quality. You can
        easily share your screen, record the conversation, and even add virtual
        backgrounds to make your video calls more fun and engaging.
      </Typography>
      <Typography variant="h6" marginY={2}>
        So whether you're catching up with friends, collaborating with
        colleagues, or just need to have a quick chat, our chat app with video
        conferencing is the perfect solution. Download our app today and start
        connecting with the people who matter most to you!
      </Typography>
    </Box>
  );
}

export default Start;
