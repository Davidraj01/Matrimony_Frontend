import { io } from "socket.io-client";
import { SOCKET_URL } from "./config";

// Must point at the same backend as axios.js — mony.bazhilgroups.in was the
// deployed *frontend's* domain, not the API, so this was never connecting
// to a server that emits chat events.
const socket = io(SOCKET_URL, {
  autoConnect: false, // ✅ IMPORTANT
  transports: ["polling", "websocket"], // optional but stable
});

export default socket;
