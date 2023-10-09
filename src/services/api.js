import axios from "axios";

const Api = axios.create({ baseURL: "http://0.0.0.0:8000" });

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token).accessToken}`;
  }
  return config;
});

export default {
  // Auth
  getIP: () => {
    return Api.get("https://api.ipify.org/?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipAddress = data.ip;
        console.log(ipAddress);
        return ipAddress;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  login: (email, password) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("username", email);
    formData.append("password", password);

    return Api.post("/token", formData);
  },
  register: (user) => {
    Api.post("/users", user);
  },
  logout: () => localStorage.removeItem("user"),

  // Get Users
  getUsers: () => {
    return Api.get("/users/");
  },

  // Get user by id
  getUser: (userId) => {
    return Api.get(`/users/${userId}`);
  },

  // Update User
  updateUser: (userId, updatedData) => {
    return Api.put(`/users/${userId}`, updatedData);
  },

  // Delete User
  deleteUser: (userId) => {
    return Api.delete(`/users/${userId}`);
  },

  // Get chat room if exist and create one if not exist
  getChatOrCreate: (chatName) => {
    return Api.get(`/chats/${chatName}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error?.response?.status === 404) {
          //          Create a new Chat
          const pattern = /^chat-\d+-\d+$/;
          return Api.post("/chats/", {
            chat_name: chatName,
            image_url: "",
            is_group: !pattern.test(chatName),
          }).then((resp) => {
            return resp.data;
          });
        }
      });
  },

  createChatGroup: (chat) => {
    return Api.post("/chats/", chat).then((resp) => {
      return resp.data;
    });
  },

  // Get Chats
  getChats: () => {
    return Api.get("/chats/");
  },

  // Create Message
  createMessage: (message) => {
    return Api.post("/messages/", message);
  },
};
