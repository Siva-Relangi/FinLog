import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import CategoryIcon from "../components/CategoryIcon";
import { useData } from "../context/DataContext";
import { colors, radii, shadow, spacing, typography } from "../theme/theme";

const ICON_SUGGESTIONS = [
  "fast-food-outline",
  "car-outline",
  "home-outline",
  "cart-outline",
  "airplane-outline",
  "cafe-outline",
  "gift-outline",
  "medkit-outline",
  "phone-portrait-outline",
  "wallet-outline",
];

export default function SettingsScreen() {
  const { categories, addCategory, clearAll, deleteCategory } = useData();
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onConfirmAddCategory = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter a category name.");
      return;
    }
    await addCategory(trimmed, newCatIcon || undefined);
    setNewCatName("");
    setNewCatIcon("");
    setCatModalOpen(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const onDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCategory(categoryId); // Call deleteCategory to remove from state
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  }

  const onClear = async () => {
    setConfirmOpen(false);
    await clearAll();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="settings-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences and data</Text>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.sectionSubtitle}>
          Manage your expense categories and add new ones
        </Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <CategoryIcon name={category.iconName} variant="large" />
              <Text style={styles.categoryName}>{category.name}</Text>
              <TouchableOpacity
                onPress={() => onDeleteCategory(category.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setCatModalOpen(true)}>
          <Ionicons name="add-circle-outline" size={20} color={colors.bgSecondary} />
          <Text style={styles.addButtonText}>Add New Category</Text>
        </TouchableOpacity>
      </View>
      
      {/* Data Management Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => setConfirmOpen(true)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        
        <Text style={styles.dangerDescription}>
          This will permanently remove all expenses and reset categories. This action cannot be undone.
        </Text>
      </View>

      {/* Create Category Modal */}
      <Modal
        visible={catModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCatModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Category</Text>
              <TouchableOpacity onPress={() => setCatModalOpen(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Add a new category to organize your expenses</Text>
            
            <TextInput
              style={styles.modalInput}
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="Category name"
              placeholderTextColor={colors.textLight}
            />
            
            <Text style={styles.modalLabel}>Choose an icon</Text>
            <FlatList
              style={styles.iconGrid}
              data={ICON_SUGGESTIONS as readonly string[]}
              keyExtractor={(i) => i}
              numColumns={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setNewCatIcon(item)}
                  style={[
                    styles.iconSuggestion,
                    newCatIcon === item && styles.iconSuggestionActive,
                  ]}
                >
                  <Ionicons 
                    name={item as any} 
                    size={24} 
                    color={newCatIcon === item ? colors.bgSecondary : colors.primary} 
                  />
                </TouchableOpacity>
              )}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setCatModalOpen(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onConfirmAddCategory} style={styles.confirmButton}>
                <Text style={styles.confirmText}>Create Category</Text>
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
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚠️ Clear All Data?</Text>
              <TouchableOpacity onPress={() => setConfirmOpen(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              This will permanently remove all expenses and reset categories. This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dangerConfirmButton}
                onPress={onClear}
              >
                <Text style={styles.dangerConfirmButtonText}>Yes, Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    ...shadow.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  
  categoriesContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  categoryName: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: spacing.md,
  },
  
  deleteButton: {
    padding: spacing.xs,
  },
  
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    ...shadow.md,
  },
  
  addButtonText: {
    ...typography.button,
    color: colors.bgSecondary,
  },
  
  dangerButton: {
    backgroundColor: colors.error + '10',
    borderWidth: 1,
    borderColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  
  dangerButtonText: {
    ...typography.button,
    color: colors.error,
  },
  
  dangerDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.lg,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  modalTitle: {
    ...typography.h4,
    color: colors.text,
  },
  
  modalSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    lineHeight: 20,
  },
  
  closeButton: {
    padding: spacing.xs,
  },
  
  modalInput: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    ...typography.bodyMedium,
  },
  
  modalLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  
  cancelText: {
    ...typography.button,
    color: colors.text,
  },
  
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  
  confirmText: {
    ...typography.button,
    color: colors.bgSecondary,
  },
  
  dangerConfirmButton: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  
  dangerConfirmButtonText: {
    ...typography.button,
    color: colors.bgSecondary,
  },
  
  iconGrid: {
    flexGrow: 0,
    marginTop: spacing.xs,
  },
  
  iconSuggestion: {
    padding: spacing.sm,
    borderRadius: radii.md,
    margin: spacing.xs,
  },
  
  iconSuggestionActive: {
    backgroundColor: colors.primary,
  },
});