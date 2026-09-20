import { create } from "zustand";

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
};

type BookingState = {
  bookings: Booking[];

  loading: boolean;

  setBookings: (
    bookings: Booking[]
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  checkConflict: (
    roomId: string,
    date: string,
    startTime: string,
    endTime: string
  ) => boolean;
};

export const useBookingStore =
  create<BookingState>((set, get) => ({
    bookings: [],

    loading: true,

    setBookings: (bookings) => {
      set({
        bookings,
      });
    },

    setLoading: (loading) => {
      set({
        loading,
      });
    },

    checkConflict: (
      roomId,
      date,
      startTime,
      endTime
    ) => {
      return get().bookings.some(
        (booking) => {
          return (
            booking.roomId === roomId &&
            booking.date === date &&
            startTime <
              booking.endTime &&
            endTime >
              booking.startTime
          );
        }
      );
    },
  }));