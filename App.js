import React from "react";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AddBed from "./src/screens/AddBeds";
import SearchScreen from "./src/screens/SearchScreen";
import Navigation from "./src/navigation/index";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

export default function App() {
  return <Navigation />;
}
