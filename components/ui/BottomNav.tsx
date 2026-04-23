import {
    ClipboardList,
    LayoutDashboard,
    ShoppingBasket,
    Wallet,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type NavItem = 'Activity' | 'Chores' | 'Expenses' | 'Groceries';

interface BottomNavProps {
  activeItem: NavItem;
  onSelect: (item: NavItem) => void;
}

const items = [
  { label: 'Activity' as NavItem, icon: LayoutDashboard },
  { label: 'Chores' as NavItem, icon: ClipboardList },
  { label: 'Expenses' as NavItem, icon: Wallet },
  { label: 'Groceries' as NavItem, icon: ShoppingBasket },
];

export default function BottomNav({ activeItem, onSelect }: BottomNavProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
      }}
    >
      {items.map((item) => {
        const isActive = activeItem === item.label;
        const Icon = item.icon;

        return (
          <Pressable
            key={item.label}
            onPress={() => onSelect(item.label)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: isActive ? 24 : 16,
              paddingVertical: isActive ? 8 : 4,
              borderRadius: 999,
              backgroundColor: isActive ? '#E8D8C4' : 'transparent',
              opacity: isActive ? 1 : 0.7,
              transform: [{ scale: isActive ? 1.05 : 1 }],
            }}
          >
            <Icon
              size={isActive ? 22 : 24}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? '#6B4F3B' : '#78716C'}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                marginTop: 4,
                color: isActive ? '#6B4F3B' : '#78716C',
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}