export type Room = {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  status: "available" | "occupied";
  facilities: string[];
};

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
};