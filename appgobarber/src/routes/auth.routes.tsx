import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LogIn from '../pages/Login';
import Register from '../pages/Register';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' }
    }}
  >
    <Auth.Screen name='LogIn' component={LogIn} />
    <Auth.Screen name='Register' component={Register} />
  </Auth.Navigator>
);

export default AuthRoutes;
