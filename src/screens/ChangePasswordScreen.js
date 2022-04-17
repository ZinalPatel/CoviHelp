import React from "react";
import { Header, Input } from "react-native-elements";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Button } from "react-native";
import { firebase } from "../firebase/config";

function ChangePasswordScreen({ navigation }) {
  const [current_password, setcurrent_password] = React.useState("");
  const [new_password, setnew_password] = React.useState("");
  const [confirm_password, setconfirm_password] = React.useState("");

  reauthenticate = () => {
    let user = firebase.auth().currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      current_password
    );

    return user.reauthenticateWithCredential(cred);
  };

  const changePassword = (current_password, new_password) => {
    if (new_password != confirm_password) {
      alert(
        "Please Enter same password in Password and Confirm Password fields."
      );

      return;
    }

    reauthenticate(current_password)
      .then(() => {
        let user = firebase.auth().currentUser;

        user
          .updatePassword(new_password)
          .then(() => {
            alert("Password Changed Successfully.");
          })
          .catch((error) => {
            console.log(error);
            let errorMessage;
            switch (error.code) {
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
          });
      })
      .catch((error) => {
        console.log(error);
        alert("Current password is Invalid.");
      });
  };
  return (
    <>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          size: 30,
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{
          text: "Change Password",
          style: { color: "#fff", fontSize: 20 },
        }}
      />

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.headertext}>
            Please enter your current password and new password to change it.
          </Text>

          <Input
            placeholder="Current Password"
            secureTextEntry={true}
            onChangeText={(text) => setcurrent_password(text)}
          />

          <Input
            placeholder="New Password"
            secureTextEntry={true}
            onChangeText={(text) => setnew_password(text)}
          />

          <Input
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => setconfirm_password(text)}
          />

          <Button
            title="Change Your Password"
            onPress={() => changePassword(current_password, new_password)}
          />
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: 20,
    paddingStart: 40,
    paddingEnd: 40,
  },
  headertext: {
    fontWeight: "bold",
    paddingTop: 20,
    paddingStart: 20,
    paddingEnd: 20,
    paddingBottom: 40,
    fontSize: 17,
  },
});

export default ChangePasswordScreen;
