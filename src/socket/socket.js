import { io } from "socket.io-client";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
// kết nối react với socket.io server đang chạy ở apiUrl
const socket = io(apiUrl,{withCredentials: true});

export default socket;