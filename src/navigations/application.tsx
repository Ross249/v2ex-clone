import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  NavigationState,
  PartialState,
  Route,
  StackActions,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Tabs from './tabs';
import { Colors, defaultTheme } from '@/theme/colors';
import {
  About,
  FavTopic,
  Follow,
  History,
  Login,
  NodeTopic,
  Profile,
  Topic,
} from '@/screens';
import { navigationRef } from './root';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { fetchBalance, fetchUserInfo } from '@/store/reducers/user';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { ROUTES } from '@/config/route';

const ApplicationNavigations = () => {
	const dispatch = useAppDispatch();
	const isLogged = useAppSelector((state) => state.user.isLogged);

	useEffect(()=>{
		if(isLogged){
			dispatch(fetchUserInfo());
			dispatch(fetchBalance());
		}
	},[dispatch,isLogged])

	return (
		<NavigationContainer theme={defaultTheme} ref={navigationRef}>
			<Stack.Naigator initialRouteName={ROUTES.TABS}
		</NavigationContainer>
	)

};

export default ApplicationNavigations;
