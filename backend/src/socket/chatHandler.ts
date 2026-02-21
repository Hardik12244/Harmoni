import { Server, Socket } from "socket.io";
import rooms, { User } from "../rooms";

export const chatHandler =(io:Server,socket:Socket)=>{

    socket.on("send-message", (message) => {
        const { roomId, userId ,userName} = socket.data
        if (!roomId || !userId) return;
        
        const room = rooms[roomId]

        const newMessage = {
            userId,
            userName,
            message,
            timestamp : Date.now()
        }
          room.messages.push(newMessage);

        io.to(roomId).emit("received-message", {
            userId,
            message
        })
    })
}