import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryIcon from "../components/CategoryIcon";
import { useData } from "../context/DataContext";

export default function SettingsScreen() {
  const { categories, addCategory, clearAll } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter a category name.");
      return;
    }
    await addCategory(trimmed, icon || undefined);
    setName("");
    setIcon("");
    setOpen(false);
  };

  const onClear = async () => {
    setConfirmOpen(false);
    await clearAll();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <CategoryIcon name={item.iconName} />
            <Text style={styles.rowText}>{item.name}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={() => setOpen(true)}>
        <Text style={styles.primaryText}>+ Add Category</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />

      <TouchableOpacity
        style={styles.dangerBtn}
        onPress={() => setConfirmOpen(true)}
      >
        <Text style={styles.dangerText}>Clear All Data</Text>
      </TouchableOpacity>

      {/* Add Category Modal */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Emoji (optional)"
              value={icon}
              onChangeText={setIcon}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={onAdd}
              >
                <Text style={styles.primaryText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1 }]}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Clear Modal */}
      <Modal
        transparent
        visible={confirmOpen}
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.modalTitle}>Clear All Data?</Text>
            <Text style={{ color: "#475569", marginBottom: 12 }}>
              This will remove all expenses and reset categories. This action
              cannot be undone.
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.dangerBtn, { flex: 1 }]}
                onPress={onClear}
              >
                <Text style={styles.dangerText}>Yes, Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1 }]}
                onPress={() => setConfirmOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  rowText: { color: "#0f172a", fontWeight: "600" },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#e2e8f0" },
  primaryBtn: {
    backgroundColor: "#0ea5e9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: { color: "white", fontWeight: "700" },
  dangerBtn: {
    borderWidth: 1,
    borderColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  dangerText: { color: "#ef4444", fontWeight: "700" },
  cancelBtn: {
    backgroundColor: "#e2e8f0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: { color: "#0f172a", fontWeight: "700" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, gap: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
  },
});
