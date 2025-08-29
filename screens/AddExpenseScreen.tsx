import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Modal, FlatList, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as Haptics from 'expo-haptics'
import { useData } from '../context/DataContext'
import { colors, radii, spacing } from '../theme/theme'
import { Ionicons } from '@expo/vector-icons'
import { AnimatedPressable } from '../components/AnimatedPressable'

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
] as const

export default function AddExpenseScreen() {
  const { categories, addExpense, addCategory } = useData()
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [note, setNote] = useState('')

  const [catModalOpen, setCatModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState<string>('pricetag-outline')

  const onSave = async () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.')
      return
    }
    if (!categoryId) {
      Alert.alert('Select category', 'Please choose a category.')
      return
    }
    await addExpense({
      amount: amt,
      categoryId,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    })
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setAmount('')
    setCategoryId('')
    setNote('')
    Alert.alert('Saved', 'Expense added.')
  }

  const onConfirmAddCategory = async () => {
    const name = newCatName.trim()
    if (!name) {
      Alert.alert('Name required', 'Please enter a category name.')
      return
    }
    const created = await addCategory(name, newCatIcon || 'pricetag-outline')
    await Haptics.selectionAsync()
    setCategoryId(created.id)
    setNewCatName('')
    setNewCatIcon('pricetag-outline')
    setCatModalOpen(false)
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Add Expense</Text>
      <Text style={styles.subtitle}>Log your spending and keep your budget on track.</Text>

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        placeholderTextColor={colors.muted}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={categoryId} onValueChange={(v) => setCategoryId(v)}>
          <Picker.Item label="Select category" value="" />
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.inlineBtn} onPress={() => setCatModalOpen(true)}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.inlineBtnText}>Add New Category</Text>
      </TouchableOpacity>

      {/* Note */}
      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="e.g. Coffee with client"
        placeholderTextColor={colors.muted}
      />

      {/* Save */}
      <AnimatedPressable onPress={onSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Expense</Text>
      </AnimatedPressable>

      {/* Add Category Modal */}
      <Modal visible={catModalOpen} transparent animationType="fade" onRequestClose={() => setCatModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.input}
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="Category name"
              placeholderTextColor={colors.muted}
            />
            <Text style={styles.smallLabel}>Icon</Text>
            <View style={styles.iconPicker}>
              <Ionicons name={(newCatIcon as any) || 'pricetag-outline'} size={20} color={colors.primary} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={newCatIcon}
                onChangeText={setNewCatIcon}
                placeholder="Ionicons name (e.g., restaurant-outline)"
                placeholderTextColor={colors.muted}
              />
            </View>
            <FlatList
              style={{ marginTop: spacing.sm }}
              horizontal
              data={ICON_SUGGESTIONS as readonly string[]}
              keyExtractor={(i) => i}
              contentContainerStyle={{ gap: spacing.sm }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setNewCatIcon(item)}
                  style={[
                    styles.iconSuggestion,
                    newCatIcon === item && { borderColor: colors.primary, backgroundColor: '#e6f6fd' },
                  ]}
                >
                  <Ionicons name={item as any} size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AnimatedPressable onPress={onConfirmAddCategory} style={[styles.saveBtn, { flex: 1 }]}>
                <Text style={styles.saveText}>Add</Text>
              </AnimatedPressable>
              <AnimatedPressable onPress={() => setCatModalOpen(false)} style={[styles.cancelBtn, { flex: 1 }]}>
                <Text style={styles.cancelText}>Cancel</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  // <CHANGE> Polished layout + fonts + colors + haptics (triggered in handlers)
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.bg },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, color: colors.text },
  subtitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.muted, marginTop: 4, marginBottom: spacing.md },
  label: { color: colors.text, fontFamily: 'Inter_600SemiBold', marginTop: spacing.md, marginBottom: spacing.xs },
  smallLabel: { color: colors.muted, fontFamily: 'Inter_600SemiBold', marginTop: spacing.sm, marginBottom: spacing.xs },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md,
    color: colors.text, fontFamily: 'Inter_500Medium',
  },
  pickerWrap: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, overflow: 'hidden' },
  inlineBtn: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 6 },
  inlineBtnText: { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radii.lg, marginTop: spacing.lg, alignItems: 'center' },
  saveText: { color: '#fff', fontFamily: 'Inter_700Bold' },
  cancelBtn: { backgroundColor: colors.border, padding: spacing.lg, borderRadius: radii.lg, alignItems: 'center' },
  cancelText: { color: colors.text, fontFamily: 'Inter_700Bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: spacing.lg },
  modalCard: { backgroundColor: '#fff', borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.text, marginBottom: spacing.sm },
  iconPicker: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  iconSuggestion: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
  },
})