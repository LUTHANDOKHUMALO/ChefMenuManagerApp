/**
 * Add / Edit dish screen.
 * The same form is used for adding a new dish and for editing an existing
 * one (pre-filled with the dish's current details), as planned in Part 1.
 *
 * - Inline red validation messages beneath each field
 * - Errors update as the chef corrects a field
 * - Confirmation message after saving, then returns to the Home screen
 * - Warns before leaving if there are unsaved changes
 * - When editing, the dish can also be deleted from here
 */
import { Picker } from '@react-native-picker/picker';
import { usePreventRemove } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import FormField from '../components/FormField';
import { COURSES, LIMITS } from '../constants/courses';
import { colors, fontSize, radius, spacing, touchTarget } from '../constants/theme';
import { useFeedback } from '../context/FeedbackContext';
import { useMenu } from '../context/MenuContext';
import { useDeleteMenuItem } from '../hooks/useDeleteMenuItem';
import type { MenuItemFormScreenProps } from '../navigation/types';
import type { Course, MenuItemFormErrors, MenuItemFormValues } from '../types/menu';
import { hasErrors, normalisePriceInput, validateMenuItem } from '../utils/validation';

const EMPTY_FORM: MenuItemFormValues = {
  dishName: '',
  description: '',
  course: '',
  price: '',
};

export default function MenuItemFormScreen({ navigation, route }: MenuItemFormScreenProps) {
  const { items, addItem, updateItem, getItemById } = useMenu();
  const { showFeedback } = useFeedback();
  const confirmDelete = useDeleteMenuItem();

  const editingId = route.params?.itemId;
  const editingItem = editingId ? getItemById(editingId) : undefined;
  const isEditing = Boolean(editingId);

  // Starting values: the existing dish when editing, otherwise an empty form.
  // Stored in state so they are only worked out once, when the screen opens.
  const [initialValues] = useState<MenuItemFormValues>(() =>
    editingItem
      ? {
          dishName: editingItem.dishName,
          description: editingItem.description,
          course: editingItem.course,
          price: editingItem.price.toFixed(2),
        }
      : EMPTY_FORM,
  );

  const [values, setValues] = useState<MenuItemFormValues>(initialValues);
  const [errors, setErrors] = useState<MenuItemFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  /** True once the dish has been saved or deleted and the screen should close. */
  const [isDone, setIsDone] = useState(false);

  const descriptionRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const errorCount = Object.keys(errors).length;

  // Ask before leaving the screen with unsaved changes (back button, Cancel, gesture).
  usePreventRemove(isDirty && !isDone, ({ data }) => {
    Alert.alert('Discard changes?', 'You have changes that have not been saved.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  // Return to the Home screen once the dish has been saved or deleted.
  useEffect(() => {
    if (isDone && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [isDone, navigation]);

  // The dish was deleted while this screen was open (should be rare).
  if (isEditing && !editingItem && !isDone) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>This dish is no longer on the menu.</Text>
        <AppButton title="Back to menu" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  /** Updates one field and re-checks the form if the chef has already tried to save. */
  const updateField = <K extends keyof MenuItemFormValues>(field: K, value: MenuItemFormValues[K]) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (submitted) {
      setErrors(validateMenuItem(nextValues, items, editingId));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    const validationErrors = validateMenuItem(values, items, editingId);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    const dish = {
      dishName: values.dishName.trim(),
      description: values.description.trim(),
      course: values.course as Course,
      price: Number(Number(normalisePriceInput(values.price)).toFixed(2)),
    };

    if (isEditing && editingId) {
      updateItem({ ...dish, id: editingId });
      showFeedback(`Changes to ${dish.dishName} saved`, 'success');
    } else {
      addItem(dish);
      showFeedback(`${dish.dishName} added to the menu`, 'success');
    }
    setIsDone(true);
  };

  const handleDelete = () => {
    if (editingItem) confirmDelete(editingItem, () => setIsDone(true));
  };

  const inputStyle = (field: keyof MenuItemFormValues) => [
    styles.input,
    errors[field] ? styles.inputError : null,
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField label="Dish name" error={errors.dishName}>
            <TextInput
              style={inputStyle('dishName')}
              value={values.dishName}
              onChangeText={(text) => updateField('dishName', text)}
              placeholder="e.g. Durban Lamb Curry"
              placeholderTextColor={colors.textMuted}
              maxLength={LIMITS.dishNameMax}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              submitBehavior="submit"
              accessibilityLabel="Dish name"
            />
          </FormField>

          <FormField
            label="Description"
            error={errors.description}
            hint={`${values.description.trim().length}/${LIMITS.descriptionMax}`}
          >
            <TextInput
              ref={descriptionRef}
              style={[inputStyle('description'), styles.multiline]}
              value={values.description}
              onChangeText={(text) => updateField('description', text)}
              placeholder="Main ingredients and how it's served"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              maxLength={LIMITS.descriptionMax}
              textAlignVertical="top"
              accessibilityLabel="Description"
            />
          </FormField>

          <FormField label="Course" error={errors.course}>
            <View style={[styles.input, styles.pickerWrapper, errors.course && styles.inputError]}>
              <Picker
                selectedValue={values.course}
                onValueChange={(value) => updateField('course', value as Course | '')}
                mode="dropdown"
                style={styles.picker}
                dropdownIconColor={colors.textMuted}
                accessibilityLabel="Course"
              >
                <Picker.Item label="Choose a course" value="" color={colors.textMuted} />
                {COURSES.map((course) => (
                  <Picker.Item key={course} label={course} value={course} color={colors.text} />
                ))}
              </Picker>
            </View>
          </FormField>

          <FormField label="Price (R)" error={errors.price}>
            <View style={[styles.input, styles.priceRow, errors.price && styles.inputError]}>
              <Text style={styles.currency}>R</Text>
              <TextInput
                style={styles.priceInput}
                value={values.price}
                onChangeText={(text) => updateField('price', text.replace(/[^0-9.,]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                maxLength={8}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                accessibilityLabel="Price in Rand"
              />
            </View>
          </FormField>

          {errorCount > 0 && (
            <Text style={styles.formError} accessibilityLiveRegion="polite">
              {errorCount === 1
                ? 'One field still needs attention.'
                : `${errorCount} fields still need attention.`}
            </Text>
          )}

          <AppButton
            title={isEditing ? 'Save changes' : 'Save menu item'}
            onPress={handleSave}
            disabled={isDone}
          />
          <AppButton
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.cancel}
          />

          {isEditing && (
            <View style={styles.deleteSection}>
              <AppButton
                title="Delete this dish"
                variant="danger"
                onPress={handleDelete}
                accessibilityHint="Removes this dish from the menu"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: touchTarget + 2,
    paddingHorizontal: spacing.md + 2,
    fontSize: fontSize.body,
    color: colors.text,
  },
  multiline: {
    minHeight: 104,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  pickerWrapper: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  priceInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text,
    alignSelf: 'stretch',
  },
  formError: {
    color: colors.error,
    fontSize: fontSize.label,
    marginBottom: spacing.md,
  },
  cancel: {
    marginTop: spacing.md,
  },
  deleteSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  missingText: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
  },
});
