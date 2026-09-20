import { Stack } from "expo-router";
import { useEffect } from "react";

import {
  subscribeBookings,
} from "../services/bookingService";

import {
  configureNotificationHandler,
} from "../services/notificationHandler";

import {
  useBookingStore,
} from "../store/bookingStore";

import { COLORS } from "../constants/theme";

export default function RootLayout() {
  const setBookings = useBookingStore(
    (state) => state.setBookings
  );

  const setLoading = useBookingStore(
    (state) => state.setLoading
  );

  useEffect(() => {
    configureNotificationHandler();

    setLoading(true);

    const unsubscribe =
      subscribeBookings(
        (firebaseBookings) => {
          const converted =
            firebaseBookings.map(
              (booking) => ({
                id: booking.id ?? "",
                roomId: booking.roomId,
                roomName: booking.roomName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
              })
            );

          setBookings(converted);
          setLoading(false);
        }
      );

    return () => {
      unsubscribe();
    };
  }, [setBookings, setLoading]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="room/[id]"
        options={{
          title: "Chi tiết phòng",
        }}
      />

      <Stack.Screen
        name="bookings"
        options={{
          title: "Lịch của tôi",
        }}
      />
    </Stack>
  );
}