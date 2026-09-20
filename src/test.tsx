import { Text, View } from "react-native";

export default function TestScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 30 }}>
        TEST ROUTE OK
      </Text>
    </View>
  );
}