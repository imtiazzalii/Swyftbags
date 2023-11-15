import React from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import Background from "./background";
import tw from 'twrnc'
import Btn from "./btn";

const Home = (props) => {
  return (
    <Background>
      <View style={tw.style('mx-10','my-64','items-center')}>
      <Text style={tw.style('text-white', 'text-5xl' , 'font-bold', 'shadow-md', 'mb-2' ,'my-2')}>
          SWYFTBAGS
        </Text>
        <Text style={tw.style('text-black','text-5xl','font-bold')}>
          YOUR BAGS ON THE GO !!
        </Text>
        <View style={styles.buttonContainer}>
          <Btn
            bgColor="#A9C1C4"
            textColor="black"
            btnLabel="Signup"
            Press={() => props.navigation.navigate("Signup")}
          />
          <Btn
            bgColor="#47ADB8"
            textColor="#000101"
            btnLabel="Login"
            Press={() => props.navigation.navigate("Login")}
          />
          <Btn
            bgColor="#47ADB8"
            textColor="#000101"
            btnLabel="Dashboard"
            Press={() => props.navigation.navigate("Dashboard")}
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginVertical: 180,
    alignItems: "center",
  },
  title: {
    color: 'white',
    fontSize: 52,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
  },
  subtitle: {
    color: 'black',
    fontSize: 46,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 40,
  },
});

export default Home;
