import { Server } from "socket.io";
import { roomHandler } from './roomHandler'
import { chatHandler } from './chatHandler'
import { musicHandler } from './musicHandler'

export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        roomHandler(io, socket);
        chatHandler(io, socket);
        musicHandler(io, socket);
    });
};