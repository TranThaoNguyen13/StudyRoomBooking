import { Platform } from "react-native";

export async function requestNotificationPermission() {
  if (Platform.OS === "web") {
    return false;
  }

  const Notifications = await import(
    "expo-notifications"
  );

  const current =
    await Notifications.getPermissionsAsync();

  if (current.status === "granted") {
    return true;
  }

  const result =
    await Notifications.requestPermissionsAsync();

  return result.status === "granted";
}

export async function scheduleBookingNotification(
  roomName: string,
  date: string,
  startTime: string
) {
  if (Platform.OS === "web") {
    console.log(
      `Notification: ${roomName} - ${date} ${startTime}`
    );

    return null;
  }

  const Notifications = await import(
    "expo-notifications"
  );

  const permission =
    await requestNotificationPermission();

  if (!permission) {
    return null;
  }

  /*
    Trong lúc DEMO:
    thông báo sau 10 giây để dễ kiểm tra.

    Sau này có thể đổi sang thời gian thật.
  */

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 Nhắc lịch đặt phòng",

        body:
          `${roomName} - ${date} ` +
          `bắt đầu lúc ${startTime}`,

        data: {
          roomName,
          date,
          startTime,
        },
      },

      trigger: {
        type:
          Notifications.SchedulableTriggerInputTypes
            .TIME_INTERVAL,

        seconds: 10,
      },
    });

  return notificationId;
}

export async function configureNotificationHandler() {
  if (Platform.OS === "web") {
    return;
  }

  const Notifications = await import(
    "expo-notifications"
  );

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}