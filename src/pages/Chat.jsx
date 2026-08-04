import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../services/socket.js";
import API from "../services/axios.js";
import { COLORS } from "../../utils/colors.js";

export default function Chat() {
  const { userId: receiverId } = useParams();
  const location = useLocation();
  const receiverName = location.state?.name;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  const userId = localStorage.getItem("userId");

  // ✅ CONNECT + JOIN
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log("🔌 CONNECTED:", socket.id);
      socket.emit("join", userId);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      // Already connected from a previous visit — "connect" won't fire
      // again, so (re)join explicitly.
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [userId]);

  // ✅ PREMIUM / SEND ERRORS FROM THE SOCKET
  useEffect(() => {
    const handleChatError = (err) => {
      alert(err?.message || "Message could not be sent");
    };
    socket.on("chatError", handleChatError);
    return () => socket.off("chatError", handleChatError);
  }, []);

  // ✅ RECEIVE MESSAGES (DEDUP FIX)
  useEffect(() => {
    const handleMessage = (msg) => {
      const senderId = msg.sender?._id || msg.sender;
      const receiverIdMsg = msg.receiver?._id || msg.receiver;

      const isRelevant =
        (senderId === userId && receiverIdMsg === receiverId) ||
        (senderId === receiverId && receiverIdMsg === userId);

      if (!isRelevant) return;

      setMessages((prev) => {
        // ❌ prevent duplicate (important fix)
        const exists = prev.some(
          (m) =>
            m._id === msg._id ||
            (m.text === msg.text &&
              m.sender === msg.sender &&
              Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 2000),
        );

        if (exists) return prev;

        return [...prev, msg];
      });
    };

    socket.off("receiveMessage");
    socket.on("receiveMessage", handleMessage);

    return () => socket.off("receiveMessage", handleMessage);
  }, [receiverId, userId]);

  // ✅ FETCH OLD MESSAGES
  useEffect(() => {
    if (!receiverId) return;
    fetchMessages();
  }, [receiverId]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Premium required to use chat 💎");
        return;
      }
      console.log(err);
    }
  };

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SEND MESSAGE (NO DUPLICATE ISSUE)
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      receiver: receiverId,
      text,
    });

    setText("");
  };

  return (
    <div
      className="flex flex-col bg-gray-100"
      style={{ height: "calc(var(--vh) * 100)" }}
    >
      {/* HEADER */}
      <div
        className={`p-4 text-white font-semibold bg-gradient-to-r ${COLORS.primary}`}
      >
        {receiverName || "Chat"}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-28">
        {messages.map((m) => {
          const senderId = m.sender?._id || m.sender;
          const isMe = senderId === userId;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs text-sm shadow ${
                  isMe
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {m.text}

                {m.createdAt && (
                  <div className="text-[10px] mt-1 opacity-70 text-right">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="fixed bottom-0 md:bottom-0 left-0 md:left-[280px] right-0 p-3 bg-white border-t flex gap-2 z-50">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          onClick={sendMessage}
          className={`px-4 py-2 rounded-full text-white bg-gradient-to-r ${COLORS.primary}`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
