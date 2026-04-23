import { Tabs } from 'expo-router'
import BottomNav, { NavItem } from '@/components/ui/BottomNav';
import Header from '@/components/ui/Header';
import { Slot, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeItem: NavItem =
    pathname === '/groceries'
          ? 'Groceries'
          : 'Activity';

  const handleSelect = (item: NavItem) => {
    if (item === 'Activity') router.push('/');
    if (item === 'Chores') router.push('/chores');
    if (item === 'Expenses') router.push('/expenses');
    if (item === 'Groceries') router.push('/groceries');
  };
}

export default function TabsLayout() {
  return (
    // <Tabs screenOptions={{ headerShown: false }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //     }}
    //   />
    // </Tabs>
    <View style={{ flex: 1 }}>
      <Header userAvatar="https://csumb.instructure.com/images/thumbnails/102974/cBVS9eVxGuykL7at5GD2Rx7no3D1htNYXZP5i5j9" />

      <View style={{ flex: 1, paddingTop: 88, paddingBottom: 100 }}>
        <Slot />
      </View>

      <BottomNav activeItem={activeItem} onSelect={handleSelect} />
    </View>
  );
}
