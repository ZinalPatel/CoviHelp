import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import SearchScreen from "../screens/SearchScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AddBeds from "../screens/AddBeds";
import FAQ from "../screens/FAQ";
import { firebase } from "../firebase/config";

const Stack = createStackNavigator();

const UserStack = () => {
  const navigationOptions = {
    gestureEnabled: false,
  };
  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen
        component={HomeScreen}
        name="Home"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={SearchScreen} name="Search" />
      <Stack.Screen component={ForgotPasswordScreen} name="Forgot Password" />
      <Stack.Screen component={FAQ} name="FAQs" />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <Text style={{ padding: 20, fontSize: 15, fontWeight: "bold" }}>
        Welcome
      </Text>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={async () => await firebase.auth().signOut()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Add Beds" component={AddBeds} />
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
    </Drawer.Navigator>
  );
}

const index = () => {
  const [login, setLogin] = React.useState(false);
  React.useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(async (user) => {
      if (user != null && user.emailVerified) setLogin(true);
      else {
        try {
          await firebase.auth().signOut();
        } catch (e) {
          console.log(e);
        }
        setLogin(false);
      }
    });
    return authListener;
  }, []);
  return (
    <NavigationContainer>
      {!login ? <UserStack /> : <MyDrawer />}
    </NavigationContainer>
  );
};

export default index;
