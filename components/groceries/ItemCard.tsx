import { Check } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface ItemCardProps {
  name: string;
  count?: number;
  addedBy: string;
  avatarUrl: string;
  isUrgent?: boolean;
  isChecked?: boolean;
  onToggle?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onCountChange?: (value: string) => void;
}

export default function ItemCard({
  name,
  count = 1,
  addedBy,
  avatarUrl,
  isUrgent = false,
  isChecked = false,
  onToggle,
  onIncrement,
  onDecrement,
  onCountChange,
}: ItemCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        isChecked ? styles.checkedContainer : styles.uncheckedContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Checkbox */}
      <Pressable
        onPress={onToggle}
        style={[
          styles.checkbox,
          isChecked ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
      >
        {isChecked && <Check size={14} color="#fff" strokeWidth={4} />}
      </Pressable>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isChecked && styles.titleChecked,
          ]}
        >
          {name} {count ? `(${count}x)` : ''}
        </Text>

        <View style={styles.metaRow}>
          {isUrgent && !isChecked && (
            <Text style={styles.urgentText}>
              Urgent •{' '}
            </Text>
          )}
          <Text style={styles.metaText}>
            {isChecked ? 'Picked up by' : 'Added by'} {addedBy}
          </Text>
        </View>
      </View>

      {isChecked && (
        <View style={styles.quantityRow}>
          <TextInput
            value={String(count)}
            onChangeText={onCountChange}
            keyboardType="number-pad"
            style={styles.quantityInput}
            placeholder="1"
            placeholderTextColor="#a1a1aa"
            textAlign="center"
          />

          <View style={styles.stepperColumn}>
            <Pressable onPress={onIncrement} style={styles.stepperButton}>
              <Text style={styles.stepperText}>+</Text>
            </Pressable>

            <Pressable onPress={onDecrement} style={styles.stepperButton}>
              <Text style={styles.stepperText}>−</Text>
            </Pressable>
          </View>
        </View>
      )}
    

      {/* Avatar */ }
  <View style={styles.avatarWrapper}>
    <Image
      source={{ uri: avatarUrl }}
      style={styles.avatar}
    />
  </View>
    </Animated.View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  uncheckedContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  checkedContainer: {
    backgroundColor: 'rgba(255, 241, 237, 0.5)',
    opacity: 0.6,
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  checkboxUnchecked: {
    borderColor: '#f0a38b',
  },

  checkboxChecked: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27272a',
  },

 titleChecked: {
  color: '#a1a1aa',
  opacity: 0.6,
},

  metaRow: {
    flexDirection: 'row',
    marginTop: 2,
  },

  urgentText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#d97706',
  },

  metaText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#a1a1aa',
  },

  quantityRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  quantityInput: {
    width: 52,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fed7aa",
    backgroundColor: "#fff7ed",
    fontSize: 14,
    fontWeight: "700",
    color: "#27272a",
    marginRight: 8,
    paddingHorizontal: 8,
  },

  stepperColumn: {
    justifyContent: "space-between",
    height: 38,
  },

  stepperButton: {
    width: 28,
    height: 17,
    borderRadius: 8,
    backgroundColor: "#ffedd5",
    justifyContent: "center",
    alignItems: "center",
  },

  stepperText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ea580c",
    lineHeight: 14,
  },

  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fae4dd',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },
});