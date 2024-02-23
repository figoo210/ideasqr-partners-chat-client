import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import Chats from "./Chats";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../services/AuthContext";
import Caller from "../components/Caller";
import { FullReadyModal } from "../components/Modal";
import Notification from "../components/Notification";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { notifyMessage, notifyReaction } from "../services/helper";
import Assets from "../assets/data";
import ConnectionLost from "../components/ConnectionLost";
import _ from 'lodash';


function Home() {
  const { user } = useContext(AuthContext);
  const audio = new Audio(Assets.messageNotification);

  // Notifications
  const [allUsers, setAllUsers] = useState();
  const [allGroups, setAllGroups] = useState();
  const [notification, setNotification] = useState("");
  const [notify, setNotify] = useState(false);

  const openNotification = () => {
    audio.play();
    setNotify(true);
  };

  const closeNotification = () => {
    setNotify(false);
  };

  const [isRinging, setIsRinging] = useState(false);
  const [isMeeting, setIsMeeting] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [callerUser, setCallerUser] = useState(null);

  const [page, setPage] = useState("");

  const getPage = (value) => {
    setPage(value);
  };

  // WebSocket
  const socketUrl = process.env.REACT_APP_WEBSOCKET_URL;
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket(socketUrl);
  const [lastMessage, setLastMessage] = useState(null);
  const [messagesQueue, setMessagesQueue] = useState([]);
  const [editedMessage, setEditedMessage] = useState(null);
  const [lastReaction, setLastReaction] = useState(null);
  const [chatGroupMembersUpdated, setChatGroupMembersUpdated] = useState(null);
  const [newUserAdded, setNewUserAdded] = useState(null);
  const [newGroupAdded, setNewGroupAdded] = useState(null);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  const [connectionLost, setConnectionLost] = useState(false);

  const makeCallWith = (fromUser, toListOfUsers, meetingInfo) => {
    const call = {
      from: fromUser,
      to: toListOfUsers,
      meeting: meetingInfo,
      type: "meeting"
    };
    sendJsonMessage(call);
  };

  const updateGroupMembers = (chat_name, members) => {
    sendJsonMessage({
      type: "update_chat_members",
      update_chat_members: "update_chat_members",
      chat_id: chat_name,
      uuid: Math.random(),
      members: members
    });
  };

  const messageSender = (msg) => {
    sendJsonMessage(msg);
  };

  useEffect(() => {

    console.log(connectionStatus);
    if (connectionStatus === "Closing" || connectionStatus === "Closed") {
      console.log("Connection Closed!!!");
      setConnectionLost(true);
    }

  }, [connectionStatus]);


  useEffect(() => {
    if (lastJsonMessage) {
      const resp = JSON.parse(lastJsonMessage);
      // console.log(resp);

      if (resp.type === "reaction") {
        let n = notifyReaction(user.data.id, resp, allUsers, allGroups); // Notification
        setNotification(n);
        n && openNotification();

        setLastReaction(resp);
      }

      if (resp.type === "message") {
        let n = notifyMessage(user.data.id, resp, allUsers, allGroups); // Notification
        setNotification(n);
        n && openNotification();

        if (messagesQueue) {
          if (messagesQueue.length > 0) {
            if (messagesQueue[0].chat_id === resp.chat_id) {
              setMessagesQueue((prevBuffer) => [...prevBuffer, resp]);
            } else {
              setMessagesQueue([resp]);
            }
          } else if (messagesQueue.length === 0) {
            setMessagesQueue([resp]);
          }
        }
        setLastMessage(resp);
      }

      if (resp.type === "edit") {
        setEditedMessage(resp);
      }

      if (resp.type === "update_chat_members") {
        setChatGroupMembersUpdated(resp);
      }

      if (resp.type === "new_group_added") {
        setNewGroupAdded(resp);
      }

      if (resp.type === "new_user_added") {
        setNewUserAdded(resp);
      }

      if (resp.type === "meeting") {
        setCallerUser(resp?.from);
        setMeeting(resp?.meeting);

        if (resp?.from && resp?.from.id === user.data.id) {
          setIsMeeting(true);
        }

        if (resp?.to && resp?.to.includes(user.data.id)) {
          handleIncomingCall();
        }
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
    <Box sx={{ display: "flex", width: "auto" }}>
      <ConnectionLost open={connectionLost} />
      {/* <Notification open={notify} handleClose={closeNotification} msg={notification} /> */}
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
              console.log("Meet External API Ready", externalApi)
            }
            onReadyToClose={() => {
              console.log("Meet is ready to be closed");
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
      <Chats
        page={page}
        makeCallWith={makeCallWith}
        getAllUsers={setAllUsers}
        getAllGroups={setAllGroups}
        updateGroupMembers={updateGroupMembers}
        messageSender={messageSender}
        lastMessage={lastMessage}
        messagesQueue={messagesQueue}
        editedMessage={editedMessage}
        lastReaction={lastReaction}
        chatGroupMembersUpdated={chatGroupMembersUpdated}
        newUserAdded={newUserAdded}
        newGroupAdded={newGroupAdded}
      />
    </Box>
  );
}

export default Home;
