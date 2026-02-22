import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

function Room() {
  const socketRef = useRef<Socket | null>(null);

  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [newTrackTitle, setNewTrackTitle] = useState("");
  const [queue, setQueue] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      const roomId = "p3ub9l"; 
      const userName = "Har" + Math.floor(Math.random() * 1000);

      socket.emit("join-room", { roomId, userName });
    });

    socket.on("room-updated", (data) => {
      setUsers(data.users);
    });

    socket.on("queue-updated", (updatedQueue) => {
      setQueue(updatedQueue);
    });

    socket.on("track-started", (updatedTrack) => {
      setCurrentTrack(updatedTrack);
      setIsPlaying(true);
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("sync-state", (state) => {
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);
      setQueue(state.queue);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Harmoni</h1>

      <h2>Now Playing:</h2>
      {currentTrack ? (
        <p>{currentTrack.title}</p>
      ) : (
        <p>No track playing</p>
      )}

      <h2>Queue</h2>
      <ul>
        {queue.map((track) => (
          <li key={track.id}>
            {track.title} - Votes: {track.votes.length}
            <button
              onClick={() =>
                socketRef.current?.emit("vote-track", track.id)
              }
            >
              Vote
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => socketRef.current?.emit("play-next")}
      >
        Play Next
      </button>

      <button
        onClick={() => socketRef.current?.emit("track-ended")}
      >
        Simulate End
      </button>

      <h2>Add Track</h2>
      <input
        type="text"
        value={newTrackTitle}
        onChange={(e) => setNewTrackTitle(e.target.value)}
      />
      <button
        onClick={() => {
          socketRef.current?.emit("add-to-queue", {
            id: Date.now().toString(),
            title: newTrackTitle,
          });
          setNewTrackTitle("");
        }}
      >
        Add Track
      </button>

      <h2>Chat</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.userName}: {msg.message}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        onClick={() => {
          socketRef.current?.emit("send-message", newMessage);
          setNewMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Room;