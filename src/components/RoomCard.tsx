import React from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    COLORS,
    RADIUS,
} from "../constants/theme";

type Room = {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  status: string;
  facilities: string[];
};

type Props = {
  room: Room;
  onPress: () => void;
};

function RoomCard({
  room,
  onPress,
}: Props) {
  const available =
    room.status === "available";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.top}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>
            📚
          </Text>
        </View>

        <View
          style={[
            styles.status,
            available
              ? styles.statusAvailable
              : styles.statusBusy,
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  available
                    ? COLORS.success
                    : COLORS.danger,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: available
                  ? COLORS.success
                  : COLORS.danger,
              },
            ]}
          >
            {available
              ? "Còn trống"
              : "Đang sử dụng"}
          </Text>
        </View>
      </View>

      <Text style={styles.name}>
        {room.name}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Text>👥</Text>

          <Text style={styles.metaText}>
            {room.capacity} người
          </Text>
        </View>

        <View style={styles.meta}>
          <Text>🏢</Text>

          <Text style={styles.metaText}>
            Tầng {room.floor}
          </Text>
        </View>
      </View>

      <View style={styles.tags}>
        {room.facilities
          .slice(0, 3)
          .map((facility) => (
            <View
              key={facility}
              style={styles.tag}
            >
              <Text style={styles.tagText}>
                {facility}
              </Text>
            </View>
          ))}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.detailText}>
          Xem chi tiết
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(RoomCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.large,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.primarySoft,
  },

  icon: {
    fontSize: 22,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusAvailable: {
    backgroundColor:
      COLORS.successSoft,
  },

  statusBusy: {
    backgroundColor:
      COLORS.dangerSoft,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  name: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 16,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 18,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 16,
  },

  tag: {
    backgroundColor:
      COLORS.surfaceSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  detailText: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
});