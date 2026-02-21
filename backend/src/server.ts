import express from "express"
import { nanoid } from "nanoid";
import rooms, { User } from './rooms'
import cors from "cors";
import { Server } from "socket.io"
import http from "http";
import { initSocket } from "./socket";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    },
});

initSocket(io);

app.get('/', (req, res) => {
    res.send("hi")
})

app.post('/rooms', (req, res) => {
    const roomId = nanoid(6);
    rooms[roomId] = {
        hostId: null,
        users: [],
        messages: [],
        queue:[],
    }

    res.send({ roomId })
})

server.listen(3000, () => {
    console.log("Server running on port 5000");
});
