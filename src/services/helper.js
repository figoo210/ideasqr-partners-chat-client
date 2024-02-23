import Assets from "../assets/data";
const { DateTime } = require('luxon');

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

export function currentDateToEgyptTime() {
  let date = new Date();

  // Get the current time zone offset in minutes
  const currentOffset = date.getTimezoneOffset();

  // Egypt time zone offset (UTC+2)
  const egyptOffset = -120;

  // Calculate the difference in minutes between current time zone and Egypt time zone
  const offsetDifference = currentOffset - egyptOffset;

  // Adjust the time by adding the offset difference
  const egyptTime = new Date(date.getTime() + (offsetDifference * 60 * 1000));

  // Create a new date object for the adjusted time
  return egyptTime;
}

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

export const getChatUsersIds = (chatName) => {
  let chatNameArr = chatName.split("-");
  chatNameArr = removeValueFromArray(chatNameArr, "chat");
  return [parseInt(chatNameArr[0]), parseInt(chatNameArr[1])];
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

export const updateMessagesWithMessage = (array, object) => {
  const index = array.findIndex(item => item.id === object.id);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index] = object;
  } else {
    // If the object with the same ID doesn't exist, add it to the end of the array
    array.push(object);
  }

  return array; // Return the modified array
}

export const updateMessagesWithReaction = (array, object) => {
  const index = array.findIndex(item => item.id === object.message_id);

  if (index !== -1) {
    if (!array[index].hasOwnProperty("reactions")) {
      array[index]["reactions"] = [object.reaction];
    } else {
      const userReactionIndex = array[index].reactions.findIndex(item => item.user_id === object.reaction.user_id);
      if (userReactionIndex !== -1) {
        array[index].reactions[userReactionIndex] = object.reaction;
      } else {
        array[index].reactions.push(object.reaction);
      }
    }
  }

  return array; // Return the modified array
}

export const updateUserLiveReactions = (array, object) => {
  if (!array || array.length === 0) {
    return [object]
  }

  const index = array.findIndex(item => item.message_id === object.message_id && item.user_id === object.user_id);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index].reaction = object.reaction;
    array[index].last_modified_at = DateTime.now().setZone("Africa/Cairo").toISO();
  } else {
    array.push(object);
  }
  return array; // Return the modified array
}

export const updateChatWithMessageReactions = (array, object) => {
  const index = array.findIndex(item => item.chat_name === object.chat_id);
  if (index !== -1) {
    const msgIndex = array[index].messages.findIndex(item => item.id === object.message_id);

    if (msgIndex !== -1) {
      if (!array[index].messages[msgIndex].hasOwnProperty("reactions")) {
        array[index].messages[msgIndex]["reactions"] = [];
      }
      const reactionIndex = array[index].messages[msgIndex].reactions.findIndex(item => item.user_id === object.reaction.user_id);
      if (reactionIndex !== -1) {
        array[index].messages[msgIndex].reactions[reactionIndex].reaction = object.reaction.reaction;
        array[index].messages[msgIndex].reactions[reactionIndex].last_modified_at = Date.now();
      } else {
        array[index].messages[msgIndex].reactions.push(object.reaction);
      }
    }
  }
  return array; // Return the modified array
}

export const updateChatWithMessage = (array, object) => {
  if (!array || !object) {
    return [];
  }
  const index = array.findIndex(item => item.chat_name === object.chat_id);
  if (index !== -1) {
    const msgIndex = array[index].messages.findIndex(item => item.id === object.id);

    if (msgIndex !== -1) {
      // If the object with the same ID exists, replace it
      array[index].messages[msgIndex] = object;
    } else {
      // If the object with the same ID doesn't exist, add it to the end of the array
      array[index].messages.push(object);
    }
  }
  return array; // Return the modified array
}


export const isMessageAddedToChat = (array, object) => {
  if (!array || !object) {
    return true;
  }
  const index = array.findIndex(item => item.chat_name === object.chat_id);
  if (index !== -1) {
    return array[index]?.messages.some(item => item.id === object.id);
  } else {
    return true;
  }
}


export const updateChatGroupWithMembers = (array, object) => {
  const index = array.findIndex(item => item.chat_name === object.chat_id);

  if (index !== -1) {
    // If the object with the same ID exists, replace it
    array[index].chat_members = object.members;
  }

  return array; // Return the modified array
}

export const makeAllMessagesSeen = (messages, user_id) => {
  if (messages && messages.length > 0) {
    for (let j = 0; j < messages.length; j++) {
      const msg = messages[j];
      if (!msg.seen && user_id !== msg.sender_id) {
        messages[j].seen = true;
      }
    }
    return messages
  }
}


// Handle Notifications

export function showNotification(title, body, iconUrl) {
  if (!('Notification' in window)) {
    console.log('Web notifications not supported in this browser.');
    return;
  }

  if (document.hidden && Notification.permission === 'granted') {
    // If permission is already granted, show the notification.
    show();
  } else if (Notification.permission !== 'denied') {
    // Request permission from the user.
    Notification.requestPermission().then(function (permission) {
      if (document.hidden && permission === 'granted') {
        show();
      } else {
        console.log('Notification permission denied by the user.');
      }
    });
  }

  function show() {

    const options = {
      body: body,
      icon: iconUrl,
    };

    const notification = new Notification(title, options);

    notification.onclick = function () {
      // Handle notification click event, e.g., open a specific URL.
      console.log('Notification clicked');
      // window.open('https://example.com'); // You can open a URL here.
    };

    notification.onclose = function () {
      // Handle notification close event.
      console.log('Notification closed');
    };
  }
}


export const notifyReaction = (currentUserId, msg, users, groups) => {
  if (currentUserId === msg.reaction.user_id) {
    return null;
  }

  let chatPattern = /^chat-.+-.*$/;
  let checker = msg?.chat_id ? chatPattern.test(msg.chat_id) : false;

  if (checker && !getChatUsersIds(msg?.chat_id).includes(currentUserId)) {
    return null;
  }
  const isUserInGroupChat = (chatId) => {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].chat_name === chatId) {
        return groups[i].chat_members?.some((item) => item.user_id === currentUserId);
      }
    }

    // If no match is found, you can return a default value (e.g., false) here.
    return false;
  };
  if (!checker && msg?.chat_id && !isUserInGroupChat(msg?.chat_id)) {
    return null;
  }


  let userName;
  users.forEach(u => {
    if (u.id === msg.reaction.user_id) {
      userName = u.name;
    }
  });

  let body = checker ? `${userName}: Reacted ${msg.reaction.reaction} to "${msg.reaction.message}"` :
    `${msg.chat_id}: ${userName} reacted ${msg.reaction.reaction} to "${msg.reaction.message}"`;

  showNotification(
    'Partners Chat | New Reaction',
    body,
    Assets.favIcon
  );

  return body;
}


export const notifyMessage = (currentUserId, msg, users, groups) => {
  if (currentUserId === msg.sender_id) {
    return null;
  }

  let chatPattern = /^chat-.+-.*$/;
  let checker = msg?.chat_id ? chatPattern.test(msg.chat_id) : false;

  if (checker && !getChatUsersIds(msg?.chat_id).includes(currentUserId)) {
    return null;
  }
  const isUserInGroupChat = (chatId) => {
    if (groups) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].chat_name === chatId) {
          return groups[i].chat_members?.some((item) => item.user_id === currentUserId);
        }
      }
    }

    // If no match is found, you can return a default value (e.g., false) here.
    return false;
  };

  if (!checker && msg?.chat_id && !isUserInGroupChat(msg?.chat_id)) {
    return null;
  }


  let userName;
  users.forEach(u => {
    if (u.id === msg.sender_id) {
      userName = u.name;
    }
  });

  let body = checker ? `${userName}: ${msg.message}` : `${msg.chat_id}: ${userName}: ${msg.message}`;

  showNotification(
    'Partners Chat | New Message',
    body,
    Assets.favIcon
  );

  return body;
}



