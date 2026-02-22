export interface User {
    userId: string;
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
    currentTrack:string,
    isPlaying:boolean,
}

export interface Track{
    id:string,
    title:string,
    addedBy:string,
    votes:string[]
}

const rooms: Record<string, any> = {};

export default rooms;