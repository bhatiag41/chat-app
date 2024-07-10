import './App.css';
import { io } from "socket.io-client";
import React, { useEffect, useState } from 'react';
// const SOCKET_SERVER_URL = "http://localhost:5000"
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  useEffect(() => {
    const socket = io();

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = io();
    socket.emit('message', input);
    setInput('');
  };
  
  return (
    <div>
    <h1>Socket.IO Chat</h1>
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button onClick={sendMessage}>Send</button>
  </div>
);
};
export default App;
