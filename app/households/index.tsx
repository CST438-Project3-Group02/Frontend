import {
  getHouseholdsByProfileId
} from '@/api/households';
import CreateHouseholdCard from '@/components/households/CreateHouseholdCard';
import HouseholdCard from '@/components/households/HouseholdCard';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Household } from '@/types/household';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { profile } = useAuthContext()
  const [ households, setHouseholds ] = useState<Household[]>([])

  useEffect(() => {
    if (!profile?.id) return;

    // get households for user
    const fetchHouseholds = async () => {
      try {
        const data = await getHouseholdsByProfileId(profile.id);
        setHouseholds(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHouseholds();
  }, [profile?.id])

  const onCreate = async () => {
    router.push(`/households/create`);
  };

  const handleOpenHousehold = (id: string) => {
    console.log('Open household:', id);
    router.push(`/households/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>Roomie</Text>

          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={20} color="#B86A33" />
            </TouchableOpacity>

            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>My Households</Text>
          <Text style={styles.heroSubtitle}>
            Enter an existing household or create a new household to get started.
          </Text>
        </View>

        <View style={styles.grid}>
          <CreateHouseholdCard onPress={onCreate} />

          {households.map((household) => (
            <HouseholdCard
              key={household.id}
              household={household}
              onPress={handleOpenHousehold}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F1EC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brand: {
    fontSize: 24,
    fontWeight: '600',
    color: '#A85E2D',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 6,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  heroSection: {
    marginBottom: 28,
    maxWidth: 680,
  },
  heroTitle: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 14,
    letterSpacing: -1.5,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 28,
    color: '#8D7A70',
    maxWidth: 580,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
});