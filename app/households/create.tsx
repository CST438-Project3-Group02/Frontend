import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateHouseholdScreen() {
  const [householdName, setHouseholdName] = useState('');
  const [rent, setRent] = useState('');
  const [numOfBedrooms, setNumOfBedrooms] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  const onCancel = () => {
    router.push('/households')
  }

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
                onChangeText={setHouseholdName}
                placeholder="My New Household"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldBlock, styles.flex1]}>
                <Text style={styles.inputLabel}>RENT (OPTIONAL)</Text>
                <TextInput
                  value={rent}
                  onChangeText={(text) =>
                    setRent(text.replace(/[^0-9.]/g, ''))
                  }
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
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
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
});