export interface User {
  userId: number;
  userName: string;
}

export interface Room {
  hostId: number | null;
  users: User[];
}
const rooms: Record<string, any> = {};

export default rooms;