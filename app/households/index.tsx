import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Household = {
  id: string;
  name: string;
  location: string;
  image: string;
  isPrimary?: boolean;
  members: string[];
  statusText: string;
  statusIcon: 'clipboard' | 'calendar' | 'cart';
};

const households: Household[] = [
  {
    id: '1',
    name: 'The Sunnyside Flat',
    location: 'San Francisco, CA',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    isPrimary: true,
    members: [
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/68.jpg',
      'https://randomuser.me/api/portraits/men/12.jpg',
    ],
    statusText: '3 chores due',
    statusIcon: 'clipboard',
  },
  {
    id: '2',
    name: 'Mountain Retreat',
    location: 'Aspen, CO',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    members: [
      'https://randomuser.me/api/portraits/women/11.jpg',
      'https://randomuser.me/api/portraits/men/18.jpg',
      'https://randomuser.me/api/portraits/women/21.jpg',
    ],
    statusText: 'Weekend trip planned',
    statusIcon: 'calendar',
  },
  {
    id: '3',
    name: 'The Heritage Lofts',
    location: 'London, UK',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    members: [
      'https://randomuser.me/api/portraits/women/24.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
    ],
    statusText: 'Grocery list updated just now',
    statusIcon: 'cart',
  },
];

function StatusIcon({ type }: { type: Household['statusIcon'] }) {
  if (type === 'clipboard') {
    return <Feather name="check-square" size={16} color="#B86A33" />;
  }

  if (type === 'calendar') {
    return <Feather name="calendar" size={16} color="#B86A33" />;
  }

  return <MaterialCommunityIcons name="cart-outline" size={16} color="#B86A33" />;
}

function AvatarStack({ members }: { members: string[] }) {
  const visible = members.slice(0, 3);
  const extraCount = members.length - visible.length;

  return (
    <View style={styles.avatarRow}>
      {visible.map((uri, index) => (
        <Image
          key={`${uri}-${index}`}
          source={{ uri }}
          style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}
        />
      ))}
      {extraCount > 0 && (
        <View style={[styles.avatarExtra, { marginLeft: -10 }]}>
          <Text style={styles.avatarExtraText}>+{extraCount}</Text>
        </View>
      )}
    </View>
  );
}

function CreateHouseholdCard({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.createCard} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.createIconCircle}>
        <Feather name="plus" size={30} color="#B86A33" />
      </View>
      <Text style={styles.createTitle}>Create Sanctuary</Text>
      <Text style={styles.createSubtitle}>Start a new household</Text>
    </TouchableOpacity>
  );
}

function HouseholdCard({
  household,
  onPress,
}: {
  household: Household;
  onPress?: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPress?.(household.id)}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: household.image }} style={styles.cardImage} />
        {household.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {household.name}
            </Text>
            <Text style={styles.cardLocation}>{household.location}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-vertical" size={20} color="#8A7467" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardMetaRow}>
          <AvatarStack members={household.members} />

          <View style={styles.statusInline}>
            <StatusIcon type={household.statusIcon} />
            <Text style={styles.statusInlineText}>{household.statusText}</Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <StatusIcon type={household.statusIcon} />
          <Text style={styles.statusPillText}>{household.statusText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HouseholdsScreen() {
  const handleCreate = () => {
    console.log('Create household');
  };

  const handleOpenHousehold = (id: string) => {
    console.log('Open household:', id);
    // router.push(`/households/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>My Sanctuaries</Text>

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
          <Text style={styles.heroTitle}>Your Retreats.</Text>
          <Text style={styles.heroSubtitle}>
            Manage your shared living spaces with intentionality. Every sanctuary is a
            community of its own.
          </Text>
        </View>

        <View style={styles.grid}>
          <CreateHouseholdCard onPress={handleCreate} />

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

const CARD_WIDTH = 300;

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
  createCard: {
    width: CARD_WIDTH,
    minHeight: 470,
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
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 210,
  },
  primaryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFF2E7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  primaryBadgeText: {
    color: '#B86A33',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
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
  menuButton: {
    paddingTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE5DE',
    marginVertical: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarExtra: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDE6E0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarExtraText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E6B60',
  },
  statusInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  statusInlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B07A35',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F6F1EC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statusPillText: {
    fontSize: 14,
    color: '#7F6D62',
    fontWeight: '500',
  },
});