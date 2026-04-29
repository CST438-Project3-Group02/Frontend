import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { Check } from 'lucide-react-native';

interface ItemCardProps {
  name: string;
  count?: number;
  addedBy: string;
  avatarUrl: string;
  isUrgent?: boolean;
  isChecked?: boolean;
  onToggle?: () => void;
}

export default function ItemCard({
  name,
  count,
  addedBy,
  avatarUrl,
  isUrgent,
  isChecked,
  onToggle,
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
  }, []);

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
          {isUrgent && (
            <Text style={styles.urgentText}>
              Urgent •{' '}
            </Text>
          )}
          <Text style={styles.metaText}>
            {isChecked ? 'Picked up by' : 'Added by'} {addedBy}
          </Text>
        </View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
      </View>
    </Animated.View>
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
    textDecorationLine: 'line-through',
    color: '#71717a',
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