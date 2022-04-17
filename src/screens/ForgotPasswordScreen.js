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

  passwordReset = () => {
    return firebase.auth().sendPasswordResetEmail(this.state.email);
  };

  handlepasswordReset = async () => {
    if (this.state.email == "") {
      alert("Please Enter your email.");

      return;
    }
    try {
      this.setState({ loading: true });
      await this.passwordReset();
      alert("Please check your mail to reset your password");
      this.setState({ loading: false });
      console.log("Done");
      // this.props.navigation.navigate('Login')
    } catch (error) {
      alert("Please Enter correct Registered Email");
      this.setState({ loading: false });
      console.log(error);
    }
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Roboto",
              marginBottom: 10,
              position: "relative",
              top: -100,
              fontWeight: "bold",
            }}
          >
            Forgot Password?
          </Text>
          <Text
            style={{
              marginBottom: 40,
              margin: 50,
              position: "relative",
              top: -100,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Please Enter Your Email here to reset your password.
          </Text>
          <View style={styles.inputView}>
            <Input
              style={styles.text}
              placeholder="Email"
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>

          <Button
            title="Reset Password"
            titleStyle={{ flex: 1, alignSelf: "center" }}
            loading={this.state.loading}
            loadingStyle={{ flex: 1, alignSelf: "center" }}
            buttonStyle={styles.btn}
            onPress={this.handlepasswordReset}
          />

          <StatusBar style="auto" />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingLeft: 65,
  },

  inputView: {
    width: "90%",
    backgroundColor: "#ecf0f3",
    height: 55,
    // marginBottom: 20,
    // justifyContent: "center",
    padding: 10,
    position: "relative",
    top: -100,
  },

  text: {
    // height: 50,
    color: "black",
  },
  btext: {
    color: "white",
  },
  btn: {
    backgroundColor: "black",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    height: 55,
  },
});
