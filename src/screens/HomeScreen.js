import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  ImageBackground,
  Image,
} from "react-native";

import AppButton from "../componants/AppButton";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/hospital.jpg")}
      style={{
        flex: 1,
        width: "100%",

        alignItems: "center",
      }}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          }}
        />
        <Text>Each Life Matters</Text>
      </View>

      <View style={styles.container}>
        <Text
          style={{
            fontSize: 27,
            marginBottom: 40,
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 2.5,
            textShadowColor: "dodgerblue",
            textShadowRadius: 30,
            color: "white",
          }}
        >
          Welcome To CoviHelp
        </Text>
        <AppButton
          title="  Hospital Login  "
          // onPress={() => console.log("tapped")}
          onPress={() => navigation.navigate("Login")}
        />
        <AppButton
          title="  Find Hospitals  "
          // onPress={() => console.log("tapped")}
          onPress={() => navigation.navigate("Search")}
        />

        <AppButton
          title="  Covid-19   FAQs   "
          // onPress={() => console.log("tapped")}
          onPress={() => navigation.navigate("FAQs")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
  },
});
