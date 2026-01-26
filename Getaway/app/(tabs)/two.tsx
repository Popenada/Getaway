import React from "react";
import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const [query, setText] = React.useState("");
  const [number, setNumber] = React.useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.search}
        onChangeText={setText}
        value={query}
        placeholder="Search Airlines"
      />

      <TextInput
        style={styles.search}
        onChangeText={setNumber}
        value={number}
        placeholder="Enter price range"
        keyboardType="numeric"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
});