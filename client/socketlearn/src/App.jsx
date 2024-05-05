import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./index.css"; // Import your CSS file

function App(props) {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketid, setSocketid] = useState("");
  const [roomName, setRoomname] = useState("");

  console.log(messages);
  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("message", { message, room });
    setRoom("");
    setMessage("");
  }
  function joinrum(e) {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomname("");
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketid(socket.id);
      console.log("Connected", socket.id);
    });
    socket.on("Welcome", (msg) => {
      console.log(msg);
    });
    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="container">
      <form onSubmit={joinrum}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomname(e.target.value)}
          placeholder="RoomID"
        />
        <button type="submit">Join Room</button>
      </form>
      <form onSubmit={handleSubmit}>
        <h1>Socket.io</h1>
        <h2>{socketid}</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room"
        />
        <button type="submit">Send Message</button>
      </form>
      <div className="messages">
        <h3>Messages</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
