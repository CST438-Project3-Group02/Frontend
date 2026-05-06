import { createHousehold } from '@/api/households';
import { colors } from '@/constants/colors';
import { useAuthContext } from '@/hooks/use-auth-context';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateHouseholdScreen() {
  const { profile } = useAuthContext();

  const [householdName, setHouseholdName] = useState('');
  const [rent, setRent] = useState('');
  const [numOfBedrooms, setNumOfBedrooms] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCancel = () => {
    router.push('/households');
  };

  const onPressCreate = () => {
    if (!householdName.trim()) {
      setError('Household name is required');
      return;
    }
    setError(null);
    setShowConfirmModal(true);
  };

  const onConfirmCreate = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        householdName,
        rentCost: rent ? parseFloat(rent) : null,
        numOfBedrooms: numOfBedrooms ? parseInt(numOfBedrooms) : null,
        address,
        city,
        state,
        zipCode,
        country,
      };

      await createHousehold(profile.profileId, payload);

      setShowConfirmModal(false);
      router.push('/households');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Create your <Text style={styles.titleAccent}>Household</Text>
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>Household Identity</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>HOUSEHOLD NAME</Text>
              <TextInput
                value={householdName}
                onChangeText={(text) => {
                  setHouseholdName(text);
                  if (error) setError(null);
                }}
                placeholder="My New Household"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  error && styles.inputError
                ]}
              />
              {error && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldBlock, styles.flex1]}>
                <Text style={styles.inputLabel}>RENT (OPTIONAL)</Text>
                <TextInput
                  value={rent}
                  onChangeText={(text) => setRent(text.replace(/[^0-9.]/g, ''))}
                  placeholder="2500.00"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.fieldBlock, styles.flex1]}>
                <Text style={styles.inputLabel}>BEDROOMS (OPTIONAL)</Text>
                <TextInput
                  value={numOfBedrooms}
                  onChangeText={(text) =>
                    setNumOfBedrooms(text.replace(/[^0-9]/g, ''))
                  }
                  placeholder="3"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>ADDRESS (OPTIONAL)</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="123 Main St"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldBlock, styles.flex2]}>
                <Text style={styles.inputLabel}>CITY (OPTIONAL)</Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="San Francisco"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
              </View>

              <View style={[styles.fieldBlock, styles.flex1]}>
                <Text style={styles.inputLabel}>STATE (OPTIONAL)</Text>
                <TextInput
                  value={state}
                  onChangeText={setState}
                  placeholder="CA"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
              </View>

              <View style={[styles.fieldBlock, styles.flex1]}>
                <Text style={styles.inputLabel}>ZIP (OPTIONAL)</Text>
                <TextInput
                  value={zipCode}
                  onChangeText={(text) =>
                    setZipCode(text.replace(/[^0-9]/g, ''))
                  }
                  placeholder="94105"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>COUNTRY (OPTIONAL)</Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholder="USA"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={onPressCreate}
            >
              <Text style={styles.primaryButtonText}>Create Household</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={onCancel}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create household?</Text>

            <Text style={styles.modalText}>
              {householdName
                ? `Are you sure you want to create "${householdName}"?`
                : 'Are you sure you want to create this household?'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalSecondaryButtonText}>Go Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalPrimaryButton,
                  isSubmitting && styles.modalPrimaryButtonDisabled,
                ]}
                onPress={onConfirmCreate}
                disabled={isSubmitting}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {isSubmitting ? 'Creating...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: '20%',
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1.4,
    textAlign: 'center',
  },
  titleAccent: {
    color: colors.primary,
    fontStyle: 'italic',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  formSection: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  fieldBlock: {
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 18, 15, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalSecondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalSecondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  modalPrimaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  modalPrimaryButtonDisabled: {
    opacity: 0.7,
  },
  modalPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
    inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
});