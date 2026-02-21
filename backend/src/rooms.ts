export interface User {
    userId: number;
    userName: string;
    socketId: string,
}

export interface Message {
    userId: string
    userName: string;
    message: string;
    timestamp: number;
}

export interface Room {
    hostId: number | null;
    users: User[];
    messages: Message[];
    queue:Track[];
}

export interface Track{
    id:string,
    title:string,
    addedBy:string,
    votes:string[]
}

const rooms: Record<string, any> = {};

export default rooms;