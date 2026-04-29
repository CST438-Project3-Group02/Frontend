import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Search, Plus } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  onAdd?: (text: string) => void;
  value?: string;
  onChangeText?: (text: string) => void;
  inputProps?: TextInputProps;
}

export default function SearchBar({
  placeholder = 'Add milk, eggs, or apples...',
  onAdd,
  value,
  onChangeText,
  inputProps,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');

  const text = value ?? internalValue;

  const handleChangeText = (newText: string) => {
    if (onChangeText) {
      onChangeText(newText);
    } else {
      setInternalValue(newText);
    }
  };

  const handleAdd = () => {
    onAdd?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Search size={20} color="#a1a1aa" />
      </View>

      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(113, 113, 122, 0.7)"
        style={styles.input}
        {...inputProps}
      />

      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Plus size={20} color="#ffffff" strokeWidth={3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fae4dd',
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 56,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#27272a',
  },
  addButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  addButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});