import React,{ useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Button,
  Image,
  Platform,
  StatusBar,
  Animated,
  FlatList,
  Dimensions,
  Modal, 
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller, handleSubmit } from "react-hook-form";
import Background from "./background";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Field from "./Field";
import Btn from "./btn";
import tw from "twrnc";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const Login = () => {

  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const onSubmit = async (data) => {
    const pushToken = await registerForPushNotificationsAsync(); // Get the token
    const loginData = {
      ...data,
      pushToken, // Include the token in the data sent to the backend
    };
    
    console.log(data)
    axios.post(Constants.expoConfig.extra.IP_ADDRESS + '/Login',loginData)
    .then(res=>
      {
      console.log(res.data);
      if(res.data.status=="ok")
      {
        Alert.alert('Login Successfull!!');
        AsyncStorage.setItem('userId',res.data.userId);
        console.log("user id is ", res.data.userId);
        AsyncStorage.setItem('token', res.data.data);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        navigation.navigate('DrawerNav');
      }else {
        Alert.alert("Error", res.data.error);  // Display specific error from the backend
      }
      
  })
  .catch(err => {
    console.error("Login Error:", err);
    // Check if error response is available and display the message from the backend
    if (err.response && err.response.data) {
      Alert.alert("Login Error", err.response.data.error || "Unknown error occurred");
    } else {
      Alert.alert("Login Error", "Network or server error");
    }
  });
  };

  const handleForgotPassword = () => {
    axios.post(`${Constants.expoConfig.extra.IP_ADDRESS}/forgot-password`, { email: email })
      .then(response => {
        Alert.alert('Success', response.data.message);
        setModalVisible(false);
      })
      .catch(error => {
        console.error("Forgot Password Error:", error);
        Alert.alert('Error', error.response ? error.response.data.error : 'Failed to reset password');
      });
  };


  return (
    <ImageBackground
      source={require("../assets/loginbg.png")}
      style={tw.style("h-full", {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      })}
    >
      <View style={styles.container}>
        <View
          style={tw.style(
            "flex-row",
            "bg-teal-900",
            "items-center",
            "w-full",
            "absolute",
            "px-1",
            "pt-1",
            "pb-1"
          )}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Routing");
            }}
          >
            <Image
              source={require("../assets/login/arrow-left.png")}
              style={styles.headerIcons}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Login</Text>
        </View>

        <View
          style={tw.style("items-center w-100", {
            marginTop: Dimensions.get("screen").height / 3,
          })}
        >
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Field
                placeholder="Email"
                keyboardType={"email-address"}
                marginBottom={0}
                onChangeText={onChange}
                value={value}
                defaultValue=""
              />
            )}
            name="Email"
          />
          {errors && errors.Email && <Text>{errors.Email.message}</Text>}

          <Controller
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum length is 8 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Field
                placeholder="Password"
                secureTextEntry={true}
                marginBottom={0}
                onChangeText={onChange}
                value={value}
                defaultValue=""
              />
            )}
            name="Password"
          />
          {errors && errors.Password && <Text>{errors.Password.message}</Text>}

          <View style={tw.style("items-end w-70 pr-4")}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Modal for Forgot Password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
            />
            <Button
              title="Reset Password"
              onPress={handleForgotPassword}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
          </View>
          <View style={tw.style("mt-6", "items-center", "justify-center")}>
            <TouchableOpacity
              style={tw.style(
                `rounded-full items-center w-32 py-4 px-5 my-5 mx-5`,
                { backgroundColor: "#47ADB8" },
                {
                  marginBottom: (Dimensions.get("screen").height * 10) / 100,
                  marginLeft: (Dimensions.get("screen").width * 40) / 100,
                }
              )}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                style={tw.style("text-black", "text-lg", "font-bold", {
                  fontSize: 22,
                })}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    alignItems: "center",
    width: 400,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1D4246",
    alignItems: "center",
    paddingHorizontal: "3%",
    paddingTop: "2%",
    paddingBottom: "2%",
  },
  headerIcons: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: Dimensions.get("window").width / 3,
    color: "#47ADB8",
    padding: 5,
  },

  contentContainer: {
    alignItems: "center",
    width: 400, // Adjust the width as needed
    marginTop: Dimensions.get("window").height / 3,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    width: "70%",
    paddingRight: 16,
  },
  forgotPasswordText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textInput: {
    height: 40,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:20,
    width: 200,
    marginBottom: 20
  },
});

export default Login;
