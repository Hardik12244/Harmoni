import { Server, Socket } from "socket.io";
import rooms, { Track } from "../rooms";

export const musicHandler = (io: Server, socket: Socket) => {

    socket.on("add-to-queue", (track) => {
        const { roomId, userId } = socket.data
        const room = rooms[roomId];
        if (!room) return;

        const newTrack = {
            ...track,
            addedBy: userId,
            votes: []
        }
        room.queue.push(newTrack);
        io.to(roomId).emit("queue-updated", room.queue)
    })

    socket.on("vote-track", (trackId) => {
        const { roomId, userId } = socket.data;
        const room = rooms[roomId];
        if (!room) return;

        const track = room.queue.find((t: Track) => t.id === trackId);
        if (!track) return;

        if (!track.votes.includes(userId)) {
            track.votes.push(userId);
        }

        room.queue.sort((a:Track, b:Track) => b.votes.length - a.votes.length);

        io.to(roomId).emit("queue-updated", room.queue);
    })
}