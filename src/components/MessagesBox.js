import React, { useEffect, useState } from "react";
import Message from "./Message";

function MessagesBox(props) {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    if (props.messages) {
      console.log(props.messages);
      setMsgs(props.messages);
    }
  }, [props.messages, props.lastMsg]);
  return (
    <div className="messages-wrapper">
      {msgs?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessagesBox;
