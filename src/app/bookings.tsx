import {
    useEffect,
    useState,
} from "react";

import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";

import {
    deleteBookingFromFirebase,
    subscribeBookings,
} from "../services/bookingService";

import {
    useBookingStore,
} from "../store/bookingStore";

import {
    COLORS,
    RADIUS,
} from "../constants/theme";

export default function BookingsScreen() {
  const bookings =
    useBookingStore(
      (state) =>
        state.bookings
    );

  const setBookings =
    useBookingStore(
      (state) =>
        state.setBookings
    );

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const unsubscribe =
      subscribeBookings(
        (firebaseBookings) => {
          setBookings(
            firebaseBookings.map(
              (booking) => ({
                id:
                  booking.id ?? "",
                roomId:
                  booking.roomId,
                roomName:
                  booking.roomName,
                date:
                  booking.date,
                startTime:
                  booking.startTime,
                endTime:
                  booking.endTime,
              })
            )
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, [setBookings]);

  const cancelBooking =
    async (id: string) => {
      try {
        setDeletingId(id);

        await deleteBookingFromFirebase(
          id
        );
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingId(null);
      }
    };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>
          Đang tải lịch...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            YOUR SCHEDULE
          </Text>

          <Text style={styles.title}>
            Lịch đã đặt
          </Text>

          <Text style={styles.subtitle}>
            Quản lý các phòng học
            bạn đã đặt.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push("/")
          }
        >
          <Text style={styles.addIcon}>
            ＋
          </Text>

          <Text
            style={styles.addText}
          >
            Đặt thêm
          </Text>
        </TouchableOpacity>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>
              📅
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            Chưa có lịch nào
          </Text>

          <Text style={styles.emptyText}>
            Chọn một phòng học và
            khung giờ phù hợp để
            bắt đầu.
          </Text>

          <TouchableOpacity
            style={
              styles.emptyButton
            }
            onPress={() =>
              router.push("/")
            }
          >
            <Text
              style={
                styles.emptyButtonText
              }
            >
              Tìm phòng
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) =>
            item.id
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          renderItem={({ item }) => {
            const deleting =
              deletingId ===
              item.id;

            return (
              <View
                style={styles.card}
              >
                <View
                  style={
                    styles.cardHeader
                  }
                >
                  <View
                    style={
                      styles.roomIcon
                    }
                  >
                    <Text
                      style={
                        styles.roomEmoji
                      }
                    >
                      📚
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.roomName
                      }
                    >
                      {item.roomName}
                    </Text>

                    <Text
                      style={
                        styles.confirmed
                      }
                    >
                      Đã xác nhận
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      cancelBooking(
                        item.id
                      )
                    }
                    disabled={
                      deleting
                    }
                  >
                    <Text
                      style={
                        styles.deleteIcon
                      }
                    >
                      🗑
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={
                    styles.separator
                  }
                />

                <View
                  style={
                    styles.details
                  }
                >
                  <View
                    style={
                      styles.detail
                    }
                  >
                    <Text
                      style={
                        styles.detailIcon
                      }
                    >
                      📅
                    </Text>

                    <View>
                      <Text
                        style={
                          styles.label
                        }
                      >
                        Ngày
                      </Text>

                      <Text
                        style={
                          styles.value
                        }
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.detail
                    }
                  >
                    <Text
                      style={
                        styles.detailIcon
                      }
                    >
                      🕘
                    </Text>

                    <View>
                      <Text
                        style={
                          styles.label
                        }
                      >
                        Thời gian
                      </Text>

                      <Text
                        style={
                          styles.value
                        }
                      >
                        {item.startTime} –{" "}
                        {item.endTime}
                      </Text>
                    </View>
                  </View>
                </View>

                {deleting && (
                  <Text
                    style={
                      styles.deleting
                    }
                  >
                    Đang hủy lịch...
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    paddingHorizontal: 22,
    paddingTop: 26,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
  },

  loading: {
    color:
      COLORS.textSecondary,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    marginBottom: 26,
    gap: 20,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 5,
  },

  subtitle: {
    color:
      COLORS.textSecondary,
    marginTop: 5,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor:
      COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius:
      RADIUS.medium,
  },

  addIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  addText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  card: {
    backgroundColor:
      COLORS.surface,
    padding: 18,
    borderRadius:
      RADIUS.large,
    marginBottom: 13,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  roomIcon: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.primarySoft,
    borderRadius: 14,
  },

  roomEmoji: {
    fontSize: 21,
  },

  roomName: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },

  confirmed: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  deleteButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor:
      COLORS.dangerSoft,
  },

  deleteIcon: {
    fontSize: 18,
  },

  separator: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 16,
  },

  details: {
    flexDirection: "row",
    gap: 30,
    flexWrap: "wrap",
  },

  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  detailIcon: {
    fontSize: 18,
  },

  label: {
    color:
      COLORS.textSecondary,
    fontSize: 11,
  },

  value: {
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 2,
  },

  deleting: {
    color: COLORS.danger,
    marginTop: 14,
    fontSize: 12,
  },

  empty: {
    backgroundColor:
      COLORS.surface,
    borderRadius:
      RADIUS.large,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 40,
    alignItems: "center",
    marginTop: 20,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.primarySoft,
  },

  emptyEmoji: {
    fontSize: 32,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 18,
  },

  emptyText: {
    color:
      COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 21,
    marginTop: 8,
  },

  emptyButton: {
    backgroundColor:
      COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 20,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});