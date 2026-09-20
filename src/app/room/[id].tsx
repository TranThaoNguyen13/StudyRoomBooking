import {
    useMemo,
    useState,
} from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { rooms } from "../../data/rooms";

import {
    addBookingToFirebase,
} from "../../services/bookingService";

import {
    scheduleBookingNotification,
} from "../../services/notificationService";

import {
    useBookingStore,
} from "../../store/bookingStore";

import {
    COLORS,
    RADIUS,
} from "../../constants/theme";

const timeSlots = [
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
];

function formatDate(date: Date) {
  return `${String(
    date.getDate()
  ).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

function getDayName(date: Date) {
  return [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
  ][date.getDay()];
}

export default function RoomDetail() {
  const { id } =
    useLocalSearchParams();

  const room = rooms.find(
    (item) =>
      item.id === String(id)
  );

  const bookings =
    useBookingStore(
      (state) =>
        state.bookings
    );

  const loadingBookings =
    useBookingStore(
      (state) =>
        state.loading
    );

  const checkConflict =
    useBookingStore(
      (state) =>
        state.checkConflict
    );

  const dates = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date();

        date.setDate(
          date.getDate() + index
        );

        return {
          value:
            formatDate(date),

          name:
            getDayName(date),

          day: String(
            date.getDate()
          ).padStart(2, "0"),

          month: String(
            date.getMonth() + 1
          ).padStart(2, "0"),
        };
      }
    );
  }, []);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    dates[0].value
  );

  const [
    selectedTime,
    setSelectedTime,
  ] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const [message, setMessage] =
    useState("");

  const [isBooking, setIsBooking] =
    useState(false);

  if (!room) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Không tìm thấy phòng
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            router.replace("/")
          }
        >
          <Text
            style={styles.homeButtonText}
          >
            Về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isBooked = (
    start: string,
    end: string
  ) =>
    bookings.some(
      (booking) =>
        booking.roomId ===
          room.id &&
        booking.date ===
          selectedDate &&
        start <
          booking.endTime &&
        end >
          booking.startTime
    );

  const handleBooking =
    async () => {
      setMessage("");

      if (!selectedTime) {
        setMessage(
          "Bạn chưa chọn khung giờ."
        );

        return;
      }

      if (
        checkConflict(
          room.id,
          selectedDate,
          selectedTime.start,
          selectedTime.end
        )
      ) {
        setMessage(
          "Khung giờ này vừa được người khác đặt."
        );

        return;
      }

      try {
        setIsBooking(true);

        await addBookingToFirebase({
          roomId: room.id,
          roomName: room.name,
          date: selectedDate,
          startTime:
            selectedTime.start,
          endTime:
            selectedTime.end,
          createdAt: Date.now(),
        });

        try {
          await scheduleBookingNotification(
            room.name,
            selectedDate,
            selectedTime.start
          );
        } catch (
          notificationError
        ) {
          console.log(
            "Notification error:",
            notificationError
          );
        }

        router.push("/bookings");
      } catch (error) {
        console.error(error);

        setMessage(
          "Không thể lưu lịch đặt. Vui lòng thử lại."
        );
      } finally {
        setIsBooking(false);
      }
    };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroEmoji}>
            📚
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {room.name}
          </Text>

          <Text style={styles.caption}>
            Tầng {room.floor} ·{" "}
            {room.capacity} người
          </Text>
        </View>

        <View style={styles.available}>
          <Text
            style={
              styles.availableText
            }
          >
            Còn trống
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>
          Tiện ích
        </Text>

        <View style={styles.features}>
          {room.facilities.map(
            (facility) => (
              <View
                key={facility}
                style={
                  styles.feature
                }
              >
                <Text
                  style={
                    styles.check
                  }
                >
                  ✓
                </Text>

                <Text
                  style={
                    styles.featureText
                  }
                >
                  {facility}
                </Text>
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>
          Chọn ngày
        </Text>

        <Text style={styles.hint}>
          Có thể đặt trong 7 ngày tới
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >
          <View style={styles.dateRow}>
            {dates.map((item) => {
              const active =
                selectedDate ===
                item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.date,
                    active &&
                      styles.dateActive,
                  ]}
                  onPress={() => {
                    setSelectedDate(
                      item.value
                    );

                    setSelectedTime(
                      null
                    );

                    setMessage("");
                  }}
                >
                  <Text
                    style={[
                      styles.dateName,
                      active &&
                        styles.dateTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={[
                      styles.dateNumber,
                      active &&
                        styles.dateTextActive,
                    ]}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={[
                      styles.dateMonth,
                      active &&
                        styles.dateTextActive,
                    ]}
                  >
                    tháng {item.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>
          Khung giờ
        </Text>

        <Text style={styles.hint}>
          {selectedDate}
        </Text>

        <View style={styles.slots}>
          {timeSlots.map(
            (slot) => {
              const booked =
                isBooked(
                  slot.start,
                  slot.end
                );

              const selected =
                selectedTime?.start ===
                slot.start;

              return (
                <TouchableOpacity
                  key={slot.start}
                  disabled={booked}
                  style={[
                    styles.slot,

                    selected &&
                      styles.slotSelected,

                    booked &&
                      styles.slotBooked,
                  ]}
                  onPress={() => {
                    setSelectedTime(
                      slot
                    );

                    setMessage("");
                  }}
                >
                  <Text
                    style={
                      styles.clock
                    }
                  >
                    🕘
                  </Text>

                  <Text
                    style={[
                      styles.slotText,

                      selected &&
                        styles.slotTextSelected,

                      booked &&
                        styles.slotTextBooked,
                    ]}
                  >
                    {slot.start} –{" "}
                    {slot.end}
                  </Text>

                  {booked && (
                    <Text
                      style={
                        styles.bookedText
                      }
                    >
                      Đã đặt
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </View>

      {selectedTime && (
        <View style={styles.summary}>
          <Text style={styles.summaryIcon}>
            📅
          </Text>

          <View>
            <Text
              style={
                styles.summaryLabel
              }
            >
              Lịch đã chọn
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {selectedDate} ·{" "}
              {selectedTime.start} –{" "}
              {selectedTime.end}
            </Text>
          </View>
        </View>
      )}

      {message !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.warning}>
            ⚠️
          </Text>

          <Text style={styles.errorText}>
            {message}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.bookButton,

          (loadingBookings ||
            isBooking) &&
            styles.buttonDisabled,
        ]}
        disabled={
          loadingBookings ||
          isBooking
        }
        onPress={handleBooking}
      >
        <Text
          style={
            styles.bookButtonText
          }
        >
          {loadingBookings
            ? "Đang đồng bộ dữ liệu..."
            : isBooking
            ? "Đang xác nhận..."
            : "Xác nhận đặt phòng"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 22,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  homeButton: {
    marginTop: 20,
    backgroundColor:
      COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      COLORS.surface,
    padding: 20,
    borderRadius:
      RADIUS.large,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    gap: 14,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.primarySoft,
  },

  heroEmoji: {
    fontSize: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },

  caption: {
    marginTop: 4,
    color:
      COLORS.textSecondary,
  },

  available: {
    backgroundColor:
      COLORS.successSoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  availableText: {
    color: COLORS.success,
    fontWeight: "700",
    fontSize: 12,
  },

  section: {
    marginTop: 26,
  },

  heading: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },

  hint: {
    color:
      COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },

  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  check: {
    color: COLORS.success,
    fontWeight: "bold",
    fontSize: 16,
  },

  featureText: {
    color: COLORS.text,
  },

  dateRow: {
    flexDirection: "row",
    gap: 9,
  },

  date: {
    width: 82,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor:
      COLORS.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dateActive: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  dateName: {
    fontSize: 12,
    color:
      COLORS.textSecondary,
  },

  dateNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    marginVertical: 2,
  },

  dateMonth: {
    fontSize: 11,
    color:
      COLORS.textSecondary,
  },

  dateTextActive: {
    color: "#FFFFFF",
  },

  slots: {
    gap: 9,
  },

  slot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minHeight: 52,
    paddingHorizontal: 16,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },

  slotSelected: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  slotBooked: {
    backgroundColor:
      COLORS.surfaceSoft,
  },

  clock: {
    fontSize: 16,
  },

  slotText: {
    color: COLORS.text,
    fontWeight: "600",
  },

  slotTextSelected: {
    color: "#FFFFFF",
  },

  slotTextBooked: {
    color: "#A9AEBB",
  },

  bookedText: {
    marginLeft: "auto",
    color:
      COLORS.textSecondary,
    fontSize: 12,
  },

  summary: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor:
      COLORS.primarySoft,
    padding: 16,
    borderRadius: 15,
    marginTop: 22,
  },

  summaryIcon: {
    fontSize: 22,
  },

  summaryLabel: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  summaryValue: {
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 3,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor:
      COLORS.dangerSoft,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },

  warning: {
    fontSize: 18,
  },

  errorText: {
    color: COLORS.danger,
    flex: 1,
  },

  bookButton: {
    backgroundColor:
      COLORS.primary,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 22,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  bookButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },
});