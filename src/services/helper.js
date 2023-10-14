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
  return message?.message;
};

export const getLatestMessageTime = (messagesList) => {
  messagesList.sort((a, b) => a.id - b.id);
  const message = messagesList[messagesList.length - 1];
  return `${message?.created_at ? message?.created_at.split("T")[1] : "-"}\n${
    message?.created_at ? message?.created_at.split("T")[0] : "-"
  }`;
};

export const removeValueFromArray = (arr, value) => {
  const index = arr.indexOf(value);

  if (index !== -1) {
    arr.splice(index, 1);
  }

  return arr;
};

export const getOtherChatUserId = (chatName, currentUserId) => {
  let chatNameArr = chatName.split("-");
  chatNameArr = removeValueFromArray(chatNameArr, "chat");
  chatNameArr = removeValueFromArray(chatNameArr, currentUserId.toString());
  return parseInt(chatNameArr[0]);
};
