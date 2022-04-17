import React from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { Header, Input, Button } from "react-native-elements";
import { firebase } from "../firebase/config";

export default class App extends React.Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection("users");
  }

  state = {
    recovery_rate: "",
    death_rate: "",
    total_available_beds: "",
    total_beds: "",
    total_special_ward: "",
    available_special_wards: "",
    available_general_wards: "",
    contact_number: "",
    isLoading: false,
    isDataAdded: false,
  };

  inputValueUpdate = (text, prop) => {
    const state = this.state;
    state[prop] = text;
    this.setState(state);
  };

  //Get previously added data (if hospitals has already added it once)

  getData = async () => {
    const uid = firebase.auth().currentUser.uid;
    let data = await this.dbRef.doc(uid).get();
    data = data.data();
    console.log(data);
    if (data.isDataAdded) {
      this.setState({
        recovery_rate: data.recovery_rate,
        death_rate: data.death_rate,
        total_available_beds: data.total_available_beds,
        total_beds: data.total_beds,
        total_special_ward: data.total_special_ward,
        available_special_wards: data.available_special_wards,
        available_general_wards: data.available_general_wards,
        contact_number: data.contact_number,
        isDataAdded: true,
      });
    }
  };

  componentDidMount() {
    console.log("dd");
    this.getData();
  }
  // this.setState({isDataAdded:data.isDataAdded,recovery_rate:data.recovery_rate,})

  //To store and update the details

  storeUser() {
    if (
      this.state.recovery_rate == "" ||
      this.state.death_rate == "" ||
      this.state.total_available_beds == "" ||
      this.state.total_beds == "" ||
      this.state.total_special_ward == "" ||
      this.state.available_special_wards == "" ||
      this.state.available_general_wards == "" ||
      this.state.contact_number == ""
    ) {
      alert("All fields are required");
      this.setState({ loading: false });
      return;
    } else {
      this.setState({
        isLoading: true,
      });
      const uid = firebase.auth().currentUser.uid;

      this.dbRef
        .doc(uid)
        .update({
          recovery_rate: this.state.recovery_rate,
          death_rate: this.state.death_rate,
          total_available_beds: this.state.total_available_beds,
          total_beds: this.state.total_beds,
          total_special_ward: this.state.total_special_ward,
          available_special_wards: this.state.available_special_wards,
          available_general_wards: this.state.available_general_wards,
          contact_number: this.state.contact_number,
          isDataAdded: true,
        })
        .then((res) => {
          !this.state.isDataAdded ? alert("Data Added") : alert("Data updated");
          this.setState({
            isLoading: false,
            isDataAdded: true,
          });
        })
        .catch((err) => {
          console.error(err);
          alert("Something went wrong try again later.");
          this.setState({
            isLoading: false,
          });
        });
    }
  }
  
  render() {
    return (
      <>
        <Header
          leftComponent={{
            icon: "menu",
            color: "#fff",
            size: 30,
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            text: "Bed Avaibility Details",
            style: { color: "#fff", fontSize: 20 },
          }}
        />
        <View style={styles.container}>
          <ScrollView>
            <Input
              keyboardType="decimal-pad"
              value={this.state.recovery_rate}
              placeholder="Recovery Rate"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "recovery_rate")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.death_rate}
              placeholder="Death Rate"
              onChangeText={(text) => this.inputValueUpdate(text, "death_rate")}
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.total_beds}
              placeholder="Total Beds"
              onChangeText={(text) => this.inputValueUpdate(text, "total_beds")}
            />

            <Input
              keyboardType="decimal-pad"
              value={this.state.total_available_beds}
              placeholder="Total Available Beds"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "total_available_beds")
              }
            />

            <Input
              keyboardType="decimal-pad"
              value={this.state.total_special_ward}
              placeholder="Total Special Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "total_special_ward")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.available_special_wards}
              placeholder="Available Special Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "available_special_wards")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.available_general_wards}
              placeholder="Available General Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "available_general_wards")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.contact_number}
              placeholder="Contact Number"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "contact_number")
              }
            />
            <Button
              title={this.state.isDataAdded ? "Update" : "Add"}
              loading={this.state.isLoading}
              onPress={() => this.storeUser()}
            />
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: 20,
    paddingStart: 20,
    paddingEnd: 20,
  },
});
