export const timestampToTime = (timestampInSeconds) => {
  const date = new Date(timestampInSeconds * 1000); // convert to milliseconds

  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();

  const formattedTime = hours + ":" + minutes.substr(-2);

  return formattedTime;
};

export const getLatestMessage = (messagesList) => {
  messagesList.sort((a, b) => a.id - b.id);
  const message = messagesList[messagesList.length - 1];
  return message?.message.includes("http") ? "File" : message?.message;
};

export const getLatestMessageNotification = (messagesList, currentUserId) => {
  messagesList.sort((a, b) => a.id - b.id);
  const message = messagesList[messagesList.length - 1];
  if (message?.sender_id === currentUserId) {
    return false;
  }
  return message?.seen ? false : true;
};

// export const getLatestMessageTime = (messagesList) => {
//   messagesList.sort((a, b) => a.id - b.id);
//   const message = messagesList[messagesList.length - 1];
//   return (
//     `${message?.created_at ? message?.created_at.split("T")[1] : "-"}`
//       .split(":")
//       .slice(0, -1)
//       .join(":") +
//     `\n${message?.created_at ? message?.created_at.split("T")[0] : "-"}`
//   );
// };

export const getLatestMessageTime = (messagesList) => {
  messagesList.sort((a, b) => a.id - b.id);
  const message = messagesList[messagesList.length - 1];

  if (!message?.created_at) {
    return "-";
  }

  const localTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const localDate = new Date(message.created_at).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `${localTime}\n${localDate}`;
};


export const removeValueFromArray = (arr, value) => {
  const index = arr.indexOf(value);

  if (index !== -1) {
    arr.splice(index, 1);
  }

  return arr;
};

export const removeFromArrayByIndex = (arr, index) => {
  arr.splice(index, 1);
  return arr;
};

export const getOtherChatUserId = (chatName, currentUserId) => {
  let chatNameArr = chatName.split("-");
  chatNameArr = removeValueFromArray(chatNameArr, "chat");
  chatNameArr = removeValueFromArray(chatNameArr, currentUserId.toString());
  return parseInt(chatNameArr[0]);
};
