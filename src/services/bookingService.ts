import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

export type FirebaseBooking = {
  id?: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: number;
};

export async function addBookingToFirebase(
  booking: Omit<FirebaseBooking, "id">
) {
  const docRef = await addDoc(
    collection(db, "bookings"),
    booking
  );

  return docRef.id;
}

export async function deleteBookingFromFirebase(
  id: string
) {
  await deleteDoc(
    doc(db, "bookings", id)
  );
}

export function subscribeBookings(
  callback: (bookings: FirebaseBooking[]) => void
) {
  const bookingsRef = collection(
    db,
    "bookings"
  );

  return onSnapshot(
    bookingsRef,

    (snapshot) => {
      const data = snapshot.docs.map(
        (document) => {
          const value = document.data();

          return {
            id: document.id,
            roomId: value.roomId,
            roomName: value.roomName,
            date: value.date,
            startTime: value.startTime,
            endTime: value.endTime,
            createdAt:
              value.createdAt ?? 0,
          };
        }
      );

      // mới nhất lên đầu
      data.sort(
        (a, b) =>
          b.createdAt - a.createdAt
      );

      console.log(
        "Firestore bookings:",
        data
      );

      callback(data);
    },

    (error) => {
      console.error(
        "Firestore realtime error:",
        error
      );
    }
  );
}