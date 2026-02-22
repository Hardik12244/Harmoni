import { Server, Socket } from "socket.io";
import rooms, { User } from "../rooms";
import { nanoid } from "nanoid";
export const roomHandler = (io: Server, socket: Socket) => {

    socket.on("join-room", ({ roomId, userName }) => {
    console.log("join-room triggered");
    console.log("RoomId:", roomId);

    const room = rooms[roomId];

    if (!room) {
        console.log("Room does not exist");
        socket.emit("error-message", "Room does not exist");
        return;
    }

    room.users = room.users.filter(
        (user: User) => user.userName !== userName
    );

    socket.join(roomId);

    const newUser: User = {
        userId: nanoid(10),
        userName: userName,
        socketId: socket.id,
    };

    room.users.push(newUser);

    if (!room.hostId) {
        room.hostId = newUser.userId;
    }

    socket.data.roomId = roomId;
    socket.data.userId = newUser.userId;
    socket.data.userName = newUser.userName;
    socket.data.socketId = newUser.socketId;

    console.log("Socket data set:", socket.data);

    io.to(roomId).emit("room-updated", {
        roomId,
        hostId: room.hostId,
        users: room.users,
    });

    socket.emit("chat-history", room.messages);

    socket.emit("sync-state", {
        currentTrack: room.currentTrack,
        isPlaying: room.isPlaying,
        queue: room.queue,
    });
});

    socket.on("disconnect", () => {
        const { roomId, userId, socketId } = socket.data;

        const room = rooms[roomId]
        if (!room) {
            socket.emit("error message", "Room does not exist")
            return
        } else {
            room.users = room.users.filter((user: User) => {
                return user.socketId !== socketId;
            })
            if (room.hostId == userId) {
                room.hostId = room.users[0].userId
            }
            if (room.users.length === 0) {
                delete rooms[roomId]
                return
            }
        }
        io.to(roomId).emit("room-updated", {
            roomId,
            hostId: room.hostId,
            users: room.users,
        });
    })
}