import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedPressable } from '../components/AnimatedPressable';
import CategoryIcon from '../components/CategoryIcon';
import { useData } from '../context/DataContext';
import { colors, radii, shadow, spacing, typography } from '../theme/theme';

// Quick icon suggestions to pick from when creating a category
const ICON_SUGGESTIONS = [
  'restaurant-outline',
  'car-outline',
  'cart-outline',
  'card-outline',
  'pricetag-outline',
  'home-outline',
  'cafe-outline',
  'bus-outline',
  'shirt-outline',
  'flash-outline',
] as const;

export default function AddExpenseScreen() {
  const { categories, addExpense, addCategory } = useData();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [note, setNote] = useState('');
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState<string>('pricetag-outline');

  // Refs for keyboard handling
  const scrollViewRef = useRef<ScrollView>(null);
  const noteInputRef = useRef<TextInput>(null);
  const noteContainerRef = useRef<View>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Helper function to get absolute position of note input
  const getNoteInputAbsolutePosition = () => {
    return new Promise<number>((resolve) => {
      if (noteContainerRef.current) {
        noteContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
          resolve(pageY);
        });
      } else {
        resolve(0);
      }
    });
  };

  // Helper function for smooth scrolling
  const scrollToNoteInput = async () => {
    if (scrollViewRef.current) {
      const absoluteY = await getNoteInputAbsolutePosition();
      if (absoluteY > 0) {
        const targetY = Math.max(0, absoluteY - 150);
        scrollViewRef.current.scrollTo({
          y: targetY,
          animated: true,
        });
      }
    }
  };

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
      setTimeout(() => {
        scrollToNoteInput();
      }, 500);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      }, 100);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const onSave = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Select category', 'Please choose a category.');
      return;
    }
    await addExpense({
      amount: amt,
      categoryId,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount('');
    setCategoryId('');
    setNote('');
    Alert.alert('Saved', 'Expense added successfully! 🎉');
  };

  const onConfirmAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) {
      Alert.alert('Name required', 'Please enter a category name.');
      return;
    }
    const created = await addCategory(name, newCatIcon || 'pricetag-outline');
    await Haptics.selectionAsync();
    setCategoryId(created.id);
    setNewCatName('');
    setNewCatIcon('pricetag-outline');
    setCatModalOpen(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      enabled={true}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="add-circle" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Add Expense</Text>
          <Text style={styles.subtitle}>Log your spending and keep your budget on track</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setCategoryId(item.id)}
                  style={[
                    styles.categoryItem,
                    categoryId === item.id && styles.categoryItemActive,
                  ]}
                >
                  <CategoryIcon
                    name={item.iconName || 'pricetag-outline'}
                    variant="small"
                  />
                  <Text
                    style={[
                      styles.categoryName,
                      categoryId === item.id && styles.categoryNameActive,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Note */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (optional)</Text>
            <View style={styles.noteInputContainer} ref={noteContainerRef}>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="e.g., Coffee with client, Groceries for dinner"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={3}
                ref={noteInputRef}
                onFocus={() => {
                  setTimeout(() => {
                    scrollToNoteInput();
                  }, 100);
                }}
              />
            </View>
          </View>

          {/* Save Button */}
          <AnimatedPressable onPress={onSave} style={styles.saveButton}>
            <Ionicons name="checkmark" size={20} color={colors.bgSecondary} />
            <Text style={styles.saveText}>Save Expense</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
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
  formContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...shadow.sm,
  },
  currencySymbol: {
    ...typography.h3,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    height: 56,
    ...typography.h2,
    color: colors.text,
    fontFamily: 'Inter_700Bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadow.sm,
  },
  categoryItem: {
    width: '30%', // Adjust for 3 columns with spacing
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    margin: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  categoryItemActive: {
    backgroundColor: colors.textLight+'80', // Solid light gray for selected category
    borderColor: colors.primary,
  },
  categoryName: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  categoryNameActive: {
    color: colors.bgSecondary,
  },
  noteInputContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadow.sm,
  },
  noteInput: {
    color: colors.text,
    ...typography.bodyMedium,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadow.md,
  },
  saveText: {
    ...typography.button,
    color: colors.bgSecondary,
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
    marginBottom: spacing.sm,
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
  iconGrid: {
    maxHeight: 120,
  },
  iconSuggestion: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    margin: spacing.xs,
  },
  iconSuggestionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
});