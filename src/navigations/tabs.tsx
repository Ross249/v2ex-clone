import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabbarNotice, TabbarMe, TabbarNode } from '@/screens/index';
import { Image, StyleSheet } from 'react-native';
import Images from '@/theme/images';
import { useAppSelector } from '@/utils/hooks';
import TopicTabs from './topic-tabs';
import { ROUTES } from '@/config/route';

const Tab = createBottomTabNavigator();

const renderIcon = (
  focused: boolean,
  activeIcon: any,
  inactiveIcon: any,
): Element => {
  const icon = focused ? activeIcon : inactiveIcon;
  return <Image source={icon} />;
};

const labelMargin = 5;

const Tabs = () => {
  const unread = useAppSelector((state) => state.user.unread);
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#200E32',
        inactiveTintColor: '#999999',
        adaptive: false,
        style: {
          shadowOpacity: 0, // remove shadow on iOS
          elevation: 0, // remove shadow on Android,
        },
        labelStyle: {
          marginTop: -labelMargin,
          marginBottom: labelMargin,
        },
      }}>
      <Tab.Screen
        name={ROUTES.TAB_INDEX}
        component={TopicTabs}
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) =>
            renderIcon(focused, Images.home, Images.homeInactive),
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_NODE}
        component={TabbarNode}
        options={{
          title: '节点',
          tabBarIcon: ({ focused }) =>
            renderIcon(focused, Images.discovery, Images.discoveryInactive),
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_NOTICE}
        component={TabbarNotice}
        options={{
          title: '消息',
          tabBarIcon: ({ focused }) =>
            renderIcon(
              focused,
              Images.notification,
              Images.notificationInactive,
            ),
          tabBarBadge: unread > 0 ? unread : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_ME}
        component={TabbarMe}
        options={{
          title: '我',
          tabBarIcon: ({ focused }) =>
            renderIcon(focused, Images.profile, Images.profileInactive),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const badgeSize = 18;

const styles = StyleSheet.create({
  badge: {
    height: badgeSize,
    fontSize: badgeSize - 6,
    fontWeight: 'bold',
    borderRadius: badgeSize,
  },
});
