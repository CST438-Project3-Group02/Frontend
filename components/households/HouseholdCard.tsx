import { Household } from '@/types/household';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HouseholdCard({
  household,
  onPress,
}: {
  household: Household;
  onPress?: (id: string) => void;
}) {

  let city = household.city ? household.city : 'City';
  let state = household.state ? household.state : 'State';

  const address = city + ', ' + state

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPress?.(household.householdId.toString())}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1 }}>
            <FontAwesome6 name="house-chimney" size={16} color="black" />
            <Text style={styles.cardTitle} numberOfLines={1}>
              {household.householdName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.cardLocation}>{address}</Text>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    minHeight: 200,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  cardContent: {
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#262626',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 15,
    color: '#9B8A80',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE5DE',
    marginVertical: 16,
  }
});