import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateHouseholdCard({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.createCard} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.createIconCircle}>
        <Feather name="plus" size={30} color={colors.primary}/>
      </View>
      <Text style={styles.createTitle}>Create a Household</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createCard: {
    width: 300,
    minHeight: 200,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E6D9CF',
    backgroundColor: '#F7F1EC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  createIconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#F1ECE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B86A33',
    marginBottom: 8,
  },
  createSubtitle: {
    fontSize: 16,
    color: '#9B8A80',
  }
});