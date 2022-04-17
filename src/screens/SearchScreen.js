import { SearchBar } from "react-native-elements";
import React from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  Linking,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Overlay } from "react-native-elements";
import { Card } from "react-native-elements";
import { firebase } from "../firebase/config";
import { Picker } from "@react-native-picker/picker";

//To show the all details added by respective hospitals by clicking on 'Show details'

const ShowDetail = ({ item }) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  return (
    <Card>
      <Text style={{ fontWeight: "bold", fontSize: 17 }}>{item.name}</Text>
      <Text>
        {item.total_beds != 0 ? (
          <>Total Available Beds: {item.total_available_beds} </>
        ) : (
          <Text style={{ color: "red" }}>
            This Hospital has not added data yet.{" "}
          </Text>
        )}
      </Text>
      <TouchableOpacity onPress={() => setIsShowDetail(!isShowDetail)}>
        <Text style={{ color: "blue" }}>Show details</Text>
        <Overlay
          isVisible={isShowDetail}
          onBackdropPress={() => setIsShowDetail(!isShowDetail)}
          backdropStyle={{ backgroundColor: "" }}
          overlayStyle={{ height: "80%", width: "80%" }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            {item.name}
            {"\n"}
          </Text>
          <Text>
            {"Full Address: " + item.haddress}
            {"\n"}
            {"\n"}

            {"City: " + item.city}
            {"\n"}
          </Text>
          {item.total_beds != 0 ? (
            <>
              <Text>
                {"Contact Number: " + item.contact_number}
                {"\n"}
                {"\n"}
                {"Recovery Rate: " + item.recovery_rate + "%"}
                {"\n"}
                {"\n"}
                {"Death Rate: " + item.death_rate + "%"}
                {"\n"}
                {"\n"}

                {"Total Bed Capacity: " + item.total_beds}
                {"\n"}
                {"\n"}
                {"Total Available Beds: " + item.total_available_beds}
                {"\n"}
                {"\n"}
                {"Total Special Wards: " + item.total_special_ward}
                {"\n"}
                {"\n"}
                {"Available Special Ward: " + item.available_special_wards}
                {"\n"}
                {"\n"}
                {"Available General Ward: " + item.available_general_wards}
              </Text>
            </>
          ) : (
            <Text style={{ alignSelf: "center", fontSize: 18, paddingTop: 30,color:'red' }}>
              Other Data is not Added by the Hospital yet.
            </Text>
          )}
        </Overlay>
      </TouchableOpacity>
    </Card>
  );
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      modalVisible: true,
      filterVisible: false,
      ShowDetailsFiletervisible: false,
      cities: [],
      city: "City",
      users: [],
      enable: false,
      index: 0,
    };
    this.fetchUsers();
    this.getCities();
  }

  fetchUsers = async () => {
    try {
      let dataRef = firebase.firestore().collection("users");
      if (this.state.search.length > 0)
        dataRef = dataRef
          .where("name", ">=", this.state.search.toLowerCase())
          .where("name", "<=", this.state.search.toLowerCase() + "\uf8ff");
      console.log(this.state.enable);
      if (this.state.enable) {
        console.log(this.state.city);
        dataRef = dataRef.where("city", "==", this.state.city);
      }

      let snapshot = await dataRef.get();
      let users = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });

      console.log("Data returned succesfully", snapshot.size);
      //this.setState({...this.state, users });
      this.setState({ users });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  //returning cities to picker

  getCities = async () => {
    var snapshot = await firebase
      .firestore()
      .collection("cities")
      .get()
      .then((snapshot) => {
        let cities = snapshot.docs.map((doc) => {
          const { name } = doc.data();

          return name;
        });
        console.log(cities);
        this.setState({ cities });
        this.setState({ city: cities[0] });
      });
  };

  toggleOverlay = () => {
    this.setState({ ...this.state, filterVisible: !this.state.filterVisible });
  };

  toggleOverlayShowDetails = (index) => {
    this.setState({
      ...this.state,
      index: index,
      ShowDetailsFiletervisible: !this.state.ShowDetailsFiletervisible,
    });
    // console.log(index);
  };

  render() {
    const { search, filterVisible, users, ShowDetailsFiletervisible } =
      this.state;
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 0 }}>
          <SearchBar
            placeholder="Search Hospitals..."
            placeholderTextColor="black"
            value={search}
            onChangeText={(text) => {
              this.setState({ search: text }, () => {
                this.fetchUsers();
              });
            }}
            inputStyle={{ backgroundColor: "white" }}
            inputContainerStyle={{ backgroundColor: "white" }}
            containerStyle={{
              backgroundColor: "grey",
            }}
            style={styles.searchtext}
          />
        </View>

        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <FlatList
              numColumns={1}
              horizontal={false}
              data={this.state.users}
              ListEmptyComponent={() => (
                <View style={{ flex: 1, alignSelf: "center", paddingTop: 15 }}>
                  <Text style={{ fontSize: 18 }}>No Results Found</Text>
                </View>
              )}
              renderItem={({ item }) => <ShowDetail item={item} />}
            />
          </View>
        </SafeAreaView>

        <View>
          <Button title="Filter" onPress={this.toggleOverlay} />
          <Overlay
            isVisible={this.state.filterVisible}
            onBackdropPress={this.toggleOverlay}
            // containerStyle={{flex:1,backgroundColor:"blue",margin:45,width:500,height:300}}
            overlayStyle={{ height: "40%", width: "70%" }}
          >
            <Text
              style={styles.overlayText}
              onPress={() => console.log(this.state.cities)}
            >
              Select City:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 4,
                marginTop: 10,
                marginBottom: 50,
              }}
            >
              <Picker
                selectedValue={this.state.city}
                style={{ height: 50, width: 250 }}
                mode={"dialog"}
                onValueChange={(itemValue) =>
                  this.setState({ city: itemValue })
                }
              >
                {this.state.cities.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Button
              title="Apply"
              buttonStyle={styles.btnstyle}
              onPress={() => {
                this.setState({ enable: true }, () => {
                  this.fetchUsers();
                  this.toggleOverlay();
                  // console.log(this.state.enable, "dealersOverallTotal1");
                });
              }}
            />
            <Button
              title="Clear"
              buttonStyle={styles.btnstyle}
              onPress={() => {
                this.setState({ enable: false }, () => {
                  this.fetchUsers(this.state.search);
                  this.toggleOverlay();
                });
              }}
            />
          </Overlay>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#ecf0f1",
  },
  super: {
    margin: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },
  sub: {
    marginLeft: 10,
    fontSize: 14,

    color: "black",
  },
  searchtext: {
    color: "black",
  },
  searchbox: {
    height: "10%",
    width: "100%",
    backgroundColor: "dodgerblue",
  },
  overlayText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  btnstyle: {
    marginBottom: 10,
  },
});
