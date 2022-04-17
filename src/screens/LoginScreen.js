import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Input } from "react-native-elements";
import { firebase } from "../firebase/config";

export default class App extends React.Component {
  state = {
    email: "",
    password: "",
  };

  onLoginPress = async () => {
    this.setState({ loading: true });
    if (this.state.password == "" || this.state.email == "") {
      alert("All fields are required");
      this.setState({ loading: false });
      return;
    }
    try {
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password);
      if (!user.emailVerified) {
        alert("Verify your email.");
        await firebase.auth().signOut();
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email address or password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many request. Try again in a minute.";
          break;
        default:
          errorMessage = "Check your internet connection.";
      }
      alert(errorMessage);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text
            style={{
              fontSize: 35,
              fontFamily: "Roboto",
              marginBottom: 30,
              fontWeight: "bold",
              marginTop: 50,
              alignSelf: "center",
            }}
          >
            Hospital Login
          </Text>
          <View style={styles.inputView}>
            <Input
              style={styles.inputText}
              placeholder="Email"
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>

          <View style={styles.inputView}>
            <Input
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(save) => this.setState({ password: save })}
            />
          </View>

          <Button
            title="Login"
            buttonStyle={styles.loginBtn}
            titleStyle={{ flex: 1, alignSelf: "center" }}
            loadingStyle={{ flex: 1, alignSelf: "center" }}
            loading={this.state.loading}
            onPress={this.onLoginPress}
          />

          <Text
            style={{ paddingTop: 15, color: "blue", alignSelf: "center" }}
            onPress={() => this.props.navigation.navigate("Forgot Password")}
          >
            Forgot Password?
          </Text>
          <Text
            style={{
              paddingTop: 15,
              color: "blue",
              alignSelf: "center",
              paddingBottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            Please register your hospital here
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    // alignItems: "center",
    // justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingLeft: 65,
    paddingStart: 30,
    paddingEnd: 30,
  },

  loginBox: {
    width: 320,
    height: 520,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
  },

  inputText: {
    height: 50,
    color: "black",
  },
  loginText: {
    color: "white",
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: "black",
    borderRadius: 10,

    alignItems: "center",
    height: 55,
  },
});
