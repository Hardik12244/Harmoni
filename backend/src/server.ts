import express from "express"
import { nanoid } from "nanoid";
import rooms from './rooms'

const app = express();

app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hi")
})

app.post('/rooms',(req,res)=>{
    const roomId = nanoid(6);
    rooms[roomId]={
        hostId:null,
        users:[]
    }

    res.send({roomId})
})

app.listen(3000);

