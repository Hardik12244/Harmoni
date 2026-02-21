import express from "express"
import { nanoid } from "nanoid";
import rooms from './rooms'

const app = express();

app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hi")
})

app.post('/rooms',(req,res)=>{
    const room = nanoid(6);
    rooms[room]={
        hostId:null,
        users:[]
    }

    res.send({room})
})


app.listen(3000);

