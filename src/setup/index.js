let token = localStorage.getItem("user_id");
console.log("token-123", token);

const apiInstance = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
  data: {},
};

export default apiInstance;
