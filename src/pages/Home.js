import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import Chats from "./Chats";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../services/AuthContext";
import Caller from "../components/Caller";
import { FullReadyModal } from "../components/Modal";
import { JitsiMeeting } from "@jitsi/react-sdk";

function Home() {
  const { user } = useContext(AuthContext);
  const [isRinging, setIsRinging] = useState(false);
  const [isMeeting, setIsMeeting] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [callerUser, setCallerUser] = useState(null);

  const [page, setPage] = useState("");

  const getPage = (value) => {
    setPage(value);
  };

  // Caller WebSocket
  const socketUrl = process.env.REACT_APP_WEBSOCKET_URL_CALLS;
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const makeCallWith = (fromUser, toListOfUsers, meetingInfo) => {
    const call = {
      from: fromUser,
      to: toListOfUsers,
      meeting: meetingInfo,
    };
    sendJsonMessage(call);
  };

  useEffect(() => {

    console.log(connectionStatus);
    if (connectionStatus === "Closing" || connectionStatus === "Closed") {
      console.log("Connection Closed!!!");
      window.location.reload();
    }

  }, [connectionStatus]);


  useEffect(() => {
    if (lastJsonMessage) {
      const call = JSON.parse(lastJsonMessage);
      // console.log(call);
      setCallerUser(call?.from);
      setMeeting(call?.meeting);

      if (call?.from && call?.from.id === user.data.id) {
        setIsMeeting(true);
      }

      if (call?.to && call?.to.includes(user.data.id)) {
        handleIncomingCall();
      }
    }
  }, [lastJsonMessage, user.data.id]);


  const handleIncomingCall = () => {
    setIsRinging(true);
  };

  const handleAnswer = () => {
    // Handle the logic when the user answers the call
    setIsRinging(false); // Close the ringing component
    setIsMeeting(true);
  };

  const handleDecline = () => {
    // Handle the logic when the user declines the call
    setIsRinging(false); // Close the ringing component
    setIsMeeting(false);
    setMeeting(null);
    setCallerUser(null);
  };

  return (
    <Box sx={{ display: "flex", width: "auto%" }}>
      <Caller
        open={isRinging}
        callerUser={callerUser}
        onAnswer={handleAnswer}
        onDecline={handleDecline}
      />
      <FullReadyModal
        open={isMeeting}
        modalTitle={"Video Call"}
        updateOpenValue={setIsMeeting}
        ModalContent={
          <JitsiMeeting
            domain="jetserver.altajer.org"
            roomName={meeting && meeting}
            configOverwrite={{
              defaultLogoUrl: "",
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              PROVIDER_NAME: "Partners Chat",
              HIDE_DEEP_LINKING_LOGO: true,
            }}
            userInfo={{
              displayName: user.data.name,
              email: user.data.email,
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
            }}
            onApiReady={(externalApi) =>
              console.log("Jitsi Meet External API", externalApi)
            }
            onReadyToClose={() => {
              console.log("Jitsi Meet is ready to be closed");
              setIsMeeting(false);
              setMeeting(null);
              setCallerUser(null);
              // window.location.reload();
            }}
          />
        }
      />

      <Box
        height={"100vh"}
        borderRight={3}
        sx={{ padding: "10px 0", textAlign: "center", width: "18%" }}
      >
        <NavBar getPage={getPage} />
      </Box>
      <Chats page={page} makeCallWith={makeCallWith} />
    </Box>
  );
}

export default Home;
