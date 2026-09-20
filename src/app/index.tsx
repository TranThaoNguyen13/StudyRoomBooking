import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";

import RoomCard from "../components/RoomCard";
import { rooms } from "../data/rooms";

import {
  COLORS,
  RADIUS,
} from "../constants/theme";

export default function HomeScreen() {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" | "available" | "large"
    >("all");

  const { width } =
    useWindowDimensions();

  const columns =
    width >= 850 ? 2 : 1;

  const filteredRooms =
    useMemo(() => {
      return rooms.filter((room) => {
        const matchSearch =
          room.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        if (!matchSearch) {
          return false;
        }

        if (
          filter === "available"
        ) {
          return (
            room.status ===
            "available"
          );
        }

        if (filter === "large") {
          return (
            room.capacity >= 8
          );
        }

        return true;
      });
    }, [search, filter]);

  const openRoom = useCallback(
    (id: string) => {
      router.push(`/room/${id}`);
    },
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            STUDY SPACE
          </Text>

          <Text style={styles.title}>
            Tìm phòng phù hợp
          </Text>

          <Text style={styles.subtitle}>
            Đặt không gian học nhóm
            nhanh chóng và thuận tiện.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() =>
            router.push("/bookings")
          }
        >
          <Text style={styles.bookingIcon}>
            📅
          </Text>

          <Text
            style={
              styles.bookingButtonText
            }
          >
            Lịch của tôi
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>
          🔎
        </Text>

        <TextInput
          style={styles.search}
          placeholder="Tìm A101, B201..."
          placeholderTextColor={
            "#A0A5B5"
          }
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filters}>
        {[
          {
            key: "all",
            label: "Tất cả",
          },
          {
            key: "available",
            label: "Còn trống",
          },
          {
            key: "large",
            label: "Từ 8 người",
          },
        ].map((item) => {
          const active =
            filter === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filter,
                active &&
                  styles.filterActive,
              ]}
              onPress={() =>
                setFilter(
                  item.key as
                    | "all"
                    | "available"
                    | "large"
                )
              }
            >
              <Text
                style={[
                  styles.filterText,
                  active &&
                    styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.resultRow}>
        <Text style={styles.sectionTitle}>
          Phòng học
        </Text>

        <Text style={styles.count}>
          {filteredRooms.length} phòng
        </Text>
      </View>

      <FlatList
        key={columns}
        numColumns={columns}
        data={filteredRooms}
        keyExtractor={(item) =>
          item.id
        }
        columnWrapperStyle={
          columns > 1
            ? styles.column
            : undefined
        }
        renderItem={({ item }) => (
          <View
            style={
              columns > 1
                ? styles.gridItem
                : undefined
            }
          >
            <RoomCard
              room={item}
              onPress={() =>
                openRoom(item.id)
              }
            />
          </View>
        )}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.list
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text
              style={styles.emptyIcon}
            >
              🔍
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              Không tìm thấy phòng
            </Text>

            <Text
              style={styles.emptyText}
            >
              Hãy thử từ khóa hoặc
              bộ lọc khác.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    paddingHorizontal: 22,
    paddingTop: 28,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 20,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 5,
  },

  subtitle: {
    maxWidth: 520,
    color: COLORS.textSecondary,
    fontSize: 15,
    marginTop: 7,
    lineHeight: 21,
  },

  bookingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor:
      COLORS.text,
    borderRadius:
      RADIUS.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  bookingIcon: {
    fontSize: 17,
  },

  bookingButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius:
      RADIUS.medium,
    paddingHorizontal: 15,
  },

  searchIcon: {
    fontSize: 18,
  },

  search: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: COLORS.text,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterActive: {
    backgroundColor:
      COLORS.primarySoft,
    borderColor:
      COLORS.primary,
  },

  filterText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  filterTextActive: {
    color: COLORS.primary,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 13,
  },

  sectionTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 20,
  },

  count: {
    color: COLORS.textSecondary,
  },

  list: {
    paddingBottom: 30,
  },

  column: {
    gap: 14,
  },

  gridItem: {
    flex: 1,
  },

  empty: {
    backgroundColor:
      COLORS.surface,
    padding: 40,
    borderRadius:
      RADIUS.large,
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  emptyIcon: {
    fontSize: 36,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
  },

  emptyText: {
    color:
      COLORS.textSecondary,
    marginTop: 6,
  },
});