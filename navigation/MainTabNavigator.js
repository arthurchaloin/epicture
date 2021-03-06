import React from 'react';
import {Platform, View} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ImageScreen from '../screens/ImageScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileNavigator from './ProfileNavigator';
import UploadScreen from '../screens/UploadScreen';
import UploadingScreen from '../screens/UploadingScreen';
import ShareScreen from '../screens/ShareScreen';

const createTabLabel = (iconName, size, padding) => ({
  tabBarLabel: ' ',
  tabBarIcon: ({focused}) => (
    <View style={{paddingTop: padding || 10}}>
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? `ios-${iconName}` : `md-${iconName}`}
        size={size}
      />
    </View>
  ),
});

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Image: ImageScreen,
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

HomeStack.navigationOptions = createTabLabel('paper', 25);

const ExploreStack = createStackNavigator({
  Explore: ExploreScreen,
  Image: ImageScreen,
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

ExploreStack.navigationOptions = createTabLabel('compass');

const UploadStack = createStackNavigator(
  {
    Upload: {
      screen: UploadScreen,
    },
    Uploading: {
      screen: UploadingScreen,
      navigationOptions: {
        header: null,
      },
    },
    Share: {
      screen: ShareScreen,
    },
  },
  {mode: 'modal'},
);

UploadStack.navigationOptions = createTabLabel('add-circle-outline', 34);

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      header: null,
    },
  },
  Image: ImageScreen,
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

SearchStack.navigationOptions = createTabLabel('search');

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      header: null,
    },
  },
  Image: ImageScreen,
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

ProfileStack.navigationOptions = createTabLabel('contact');

// const SettingsStack = createStackNavigator({
//   Settings: SettingsScreen,
// });

// SettingsStack.navigationOptions = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({focused}) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
//     />
//   ),
// };

export default createBottomTabNavigator({
  HomeStack,
  ExploreStack,
  UploadStack,
  ProfileStack,
  SearchStack,
});
