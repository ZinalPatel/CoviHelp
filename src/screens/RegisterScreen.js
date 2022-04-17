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
import { Button, Input } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { firebase } from "../firebase/config";

export default class App extends React.Component {
  state = {
    email: "",
    password: "",
    confirm_password: "",
    haddress: "",
    city: "",
    name: "",
    hospital_verification_code: "",
    codes: [],
    loading: false,
  };

  render() {
    const onRegisterPress = async () => {
      this.setState({ loading: true });
      if (
        this.state.password == "" ||
        this.state.email == "" ||
        this.state.haddress == "" ||
        this.state.city == "" ||
        this.state.name == "" ||
        this.state.hospital_verification_code == "" ||
        this.state.confirm_password == ""
      ) {
        alert("All fields are required");
        this.setState({ loading: false });
        return;
      }
      if (this.state.password != this.state.confirm_password) {
        alert(
          "Please Enter same password in Password and Confirm Password fields."
        );
        this.setState({ loading: false });
        return;
      }
      try {
        const verified = await firebase
          .firestore()
          .collection("VerificationCodes")
          .where(
            "hospital_verification_code",
            "==",
            this.state.hospital_verification_code
          )
          .get();
        if (verified.docs.length == 0) {
          alert("Verification code is Invalid");
          this.setState({ loading: false });
          return;
        }
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        await user.sendEmailVerification();
        const data = {
          haddress: this.state.haddress,
          city: this.state.city,
          name: this.state.name.toLowerCase(),
          isDataAdded: false,
          recovery_rate: 0,
          death_rate: 0,
          total_available_beds: 0,
          total_beds: 0,
          total_special_ward: 0,
          available_special_wards: 0,
          available_general_wards: 0,
          contact_number: "",
        };
        const usersRef = firebase.firestore().collection("users");
        const citiesRef = firebase.firestore().collection("cities");
        let city = await citiesRef.where("name", "==", this.state.city).get();
        if (city.size == 0) citiesRef.add({ name: this.state.city });
        await usersRef.doc(user.uid).set(data);
        alert("Registration completed please verify your email.");
        await firebase.auth().signOut();
        this.setState({
          email: "",
          password: "",
          haddress: "",
          city: "",
          name: "",
          confirm_password: "",
          hospital_verification_code: "",
          loading: false,
        });
      } catch (error) {
        console.log(error);
        let errorMessage;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address format.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "E-mail already in use.";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak.";
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

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Roboto",
              paddingTop: 0,
              marginBottom: 30,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            Hospital Registration
          </Text>

          <Input
            keyboardType="email-address"
            style={styles.inputText}
            value={this.state.email}
            placeholder="Hospital's offical Email"
            onChangeText={(text) => this.setState({ email: text })}
            style={{ width: "80%" }}
          />

          <Input
            style={styles.inputText}
            value={this.state.name}
            placeholder="Hospital name"
            onChangeText={(txt) => this.setState({ name: txt })}
          />

          <Input
            style={styles.inputText}
            value={this.state.password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(save) => this.setState({ password: save })}
          />

          <Input
            style={styles.inputText}
            value={this.state.confirm_password}
            placeholder="Confirm password"
            secureTextEntry={true}
            onChangeText={(save) => this.setState({ confirm_password: save })}
          />

          <Input
            style={styles.inputText}
            value={this.state.haddress}
            placeholder="Hospital Full Address"
            onChangeText={(text) => this.setState({ haddress: text })}
          />

          <Input
            style={styles.inputText}
            value={this.state.city}
            placeholder="City(of Hospital)"
            onChangeText={(text) => this.setState({ city: text })}
          />

          <Input
            style={styles.inputText}
            value={this.state.hospital_verification_code}
            placeholder="Hospital Verification Code"
            onChangeText={(text) =>
              this.setState({ hospital_verification_code: text })
            }
          />

          <Button
            title="Register"
            buttonStyle={styles.loginBtn}
            titleStyle={{ flex: 1, alignSelf: "center" }}
            loading={this.state.loading}
            loadingStyle={{ flex: 1, alignSelf: "center" }}
            onPress={onRegisterPress}
          />

          <Text
            style={{
              paddingTop: 15,
              color: "blue",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              paddingBottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Login here
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
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingLeft: 65,
    // paddingTop: 20,
    paddingStart: 30,
    paddingEnd: 30,
  },

  inputText: {
    height: 50,
    color: "black",
  },
  loginText: {
    color: "white",
  },
  loginBtn: {
    backgroundColor: "black",
    borderRadius: 10,
    // width: "72%",
    alignItems: "center",
    height: 55,
  },
});
