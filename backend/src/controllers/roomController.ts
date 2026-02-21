import { Request, Response } from "express";
import rooms, { User } from "../rooms";
import { nanoid } from "nanoid";

const joinRoom = async (req: Request, res: Response) => {
    const { roomId, userName } = req.body;

    if (!roomId || !userName) return res.json({ success: false, msg: "invalid" })
    const room = rooms[roomId]
    if (!room) {
        return res.json({ error: "Room does not exist" })
    }
    else {
        const existingUser = room.users.find((user: User) => user.userName === userName)

        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User with this name already in room",
            });
        } else {
            const newUser = {
                userId: nanoid(10),
                userName: userName
            };
            room.users.push(newUser);
            if (!room.hostId) {
                room.hostId = newUser.userId;
            }
            return res.json({ roomId })
        }

    }
}

const leaveRoom = async (req: Request, res: Response) => {
    const { roomId, userName, userId } = req.body;
    if (!roomId || !userId) return res.json({ success: false, msg: "invalid" })
    const room = rooms[roomId]
    if (!room) {
        return res.json({ error: "Room does not exist" })
    } else {
        room.users = room.users.filter((user: User) => {
            return user.userId !== userId;
        })

        if (room.hostId == userId) {
            room.hostId = room.users[0].userId
            return res.status(200).json({
                success: true,
                room: {
                    roomId,
                    hostId: room.hostId,
                    users: room.users,
                },
            });
        }
        if (room.users.length === 0) {
            delete rooms[roomId]
            return res.status(200).json({
                success: true,
                msg: "Room deleted (empty)",
            });
        }
    }

}