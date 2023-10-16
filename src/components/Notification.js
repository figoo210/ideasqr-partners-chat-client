import * as React from "react";

import messageSound from "../assets/audio/alert.wav";
import callSound from "../assets/audio/alert.wav";
import { Alert } from "@mui/material";

export function Notification({
  type,
  msg,
  msgType,
  handleClose,
  handleAcceptCalls,
  handleOpenMessage,
}) {
  const audio = React.useRef();

  React.useEffect(() => {
    if (type === "message") {
      audio.current.src = messageSound;
      audio.current.play();
    } else if (type === "call") {
      audio.current.src = callSound;
      audio.current.play();
    }
  }, [type]);

  return (
    <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }}>
      {msg}
      <audio ref={audio} />
    </Alert>
  );
}

export default Notification;
