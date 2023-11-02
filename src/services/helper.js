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
  if (messagesList.length === 0) {
    return false;
  }
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
  if (!messagesList.length) {
    return "-";
  }
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

export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const shortenString = (inputString, maxLength) => {
  if (inputString && inputString.length > 0) {
    if (inputString?.length <= maxLength) {
      return inputString;
    }

    const truncatedString = inputString?.slice(0, maxLength - 3); // Leave space for "..."
    return truncatedString + '...';
  }
}

export function shortenFileName(fileName, maxLength) {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  const name = fileName.substring(0, maxLength - 3); // Leave room for "..."
  const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2); // Get the file extension
  return `${name}...${extension}`;
}

export const updateMessagesWithMessage = (array, object, temp_id) => {
  const index = array.findIndex(item => item.id === temp_id);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index] = object;
  } else {
    // If the object with the same ID doesn't exist, add it to the end of the array
    array.push(object);
  }

  return array; // Return the modified array
}

export const updateMessageReactions = (array, object) => {
  const messageId = object.message_id;
  const index = array.findIndex(item => item.id === messageId);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index]["reactions"].push(object);
  }
  return array; // Return the modified array
}

export const updateChatsWithChat = (array, object) => {
  const objectId = object.chat_name;
  const index = array.findIndex(item => item.chat_name === objectId);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index] = object;
  } else {
    // If the object with the same ID doesn't exist, add it to the end of the array
    array.push(object);
  }

  return array; // Return the modified array
}

