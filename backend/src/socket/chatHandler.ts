import { Server, Socket } from "socket.io";
import rooms, { User } from "../rooms";

export const chatHandler = (io: Server, socket: Socket) => {

    socket.on("send-message", (message) => {
        console.log("send-message triggered");
    console.log("socket.data:", socket.data);
        const { roomId, userId, userName } = socket.data
        if (!roomId || !userId) return;

        const room = rooms[roomId]

        const newMessage = {
            userId,
            userName,
            message,
            timestamp: Date.now()
        }
        room.messages.push(newMessage);

        io.to(roomId).emit("receive-message", {
            userId,
            userName,
            message,
            timestamp: Date.now()
            
        })
        console.log("Message received on backend:", message);
    })
}