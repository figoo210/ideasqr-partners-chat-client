import axios from "axios";

const Api = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token).access_token}`;
  }

  return config;
});

export default {
  // Auth
  getIP: () => {
    return axios
      .get("https://api.ipify.org/?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipAddress = data.ip;
        return ipAddress;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },

  login: (email, password, user_ip) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("username", email);
    formData.append("password", password);
    Api.defaults.headers["X-User-IP"] = user_ip;
    return Api.post("/token", formData)
  },

  register: (user) => {
    return Api.post("/users", user);
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

  // Get user by id
  getme: (userId) => {
    return Api.get(`/users/me/${userId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.message);
      });
  },

  // Update User
  updateUser: (userId, updatedData) => {
    return Api.put(`/users/${userId}`, updatedData);
  },

  // Delete User
  deleteUser: (userId) => {
    return Api.delete(`/users/${userId}`);
  },

  // Roles
  newRolePermission: (rolePermission) => {
    return Api.post("/role_permissions/", rolePermission);
  },

  addRole: (role) => {
    return Api.post("/roles/", role);
  },

  addPermission: (permission) => {
    return Api.post("/permissions/", permission);
  },

  getRoles: () => {
    return Api.get("/roles/");
  },

  getPermissions: () => {
    return Api.get("/permissions/");
  },

  getRolesPermissions: () => {
    return Api.get("/role_permissions/");
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

  getChatById: (chat_id) => {
    return Api.get(`/chats/${chat_id}`);
  },

  // Create Message
  createMessage: (message) => {
    return Api.post("/messages/", message);
  },

  messageSeen: (id) => {
    return Api.get(`/messages/${id}`);
  },

  updateMessage: (id, message) => {
    return Api.put(`/messages/${id}`, message);
  },

  chatMessages: (id) => {
    return Api.get(`/chat/messages/${id}`);
  },

  // Reactions
  reactOnMessage: (reaction) => {
    return Api.post("/message_reactions/", reaction);
  },

  getReactions: (messageId) => {
    return Api.get(`/message_reactions/${messageId}`);
  },

  // IPs
  getIPsGroups: () => {
    return Api.get("/ip_groups");
  },

  addIPGroup: (ipGroup) => {
    return Api.post("/ip_groups", ipGroup);
  },

  updateIPGroup: (ipGroup) => {
    return Api.put("/ip_groups", ipGroup);
  },

  deleteIPGroup: (ip) => {
    return Api.delete(`/ip_groups/${ip}`);
  },

  addShortcutReply: (id, reply) => {
    return Api.put(`/reply_shortcuts/${id}`, { reply: reply });
  },
};
