import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  RefreshControl,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          `${Constants.expoConfig.extra.IP_ADDRESS}/notifications`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.status === "ok") {
          const sortedNotifications = response.data.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setNotifications(sortedNotifications);
          console.log(sortedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  

  const handleNotificationPress = async (notificationId, notificationType) => {
    // Mark the notification as viewed
    const token = await AsyncStorage.getItem("token");
    await axios.patch(
      `${Constants.expoConfig.extra.IP_ADDRESS}/notification/${notificationId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // Update the local state to reflect the change
    setNotifications(
      notifications.map((notification) => {
        if (notification._id === notificationId) {
          return { ...notification, viewed: true };
        }
        return notification;
      })
    );

    // Navigate based on notification type
    if (notificationType === "chat") {
      navigation.navigate("AllChats");
    } else if (notificationType === "bid") {
      navigation.navigate("CurrentTrips");
    } else if (notificationType === "Accept") {
      navigation.navigate("AllChats");
    }
  };

  return (
    <View style={styles.flexContainer}>
      <ImageBackground
        source={require("../assets/AllChats/Background.png")}
        style={styles.imageBackground}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={require("../assets/Dashboard/menu2.png")}
                  style={styles.headerIcons}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Notifications</Text>
              <Image
                source={require("../assets/Dashboard/bell2.png")}
                style={styles.headerIcons}
              />
            </View>
            <ScrollView style={styles.container}>
              <View style={styles.notificationContainer}>
                {notifications.length === 0 ? (
                  <View style={styles.noNotificationsContainer}>
                    <Text style={styles.noNotificationsText}>
                      No notifications available
                    </Text>
                  </View>
                ) : (
                  notifications.map((notification) => (
                    <TouchableOpacity
                      key={notification._id}
                      style={[
                        styles.notificationItem,
                        notification.viewed
                          ? styles.viewedNotification
                          : null,
                      ]}
                      onPress={() =>
                        handleNotificationPress(
                          notification._id,
                          notification.type
                        )
                      }
                    >
                      <Text style={styles.notificationText}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Text style={styles.footerText}>swyftbags ltd.</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};


const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  viewedNotification: {
    backgroundColor: "#30949D", // Change this color as per your design
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
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#47ADB8",
    padding: 5,
  },
  notificationContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  notificationItem: {
    backgroundColor: "#1D4246",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  notificationText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 14,
    color: "white",
    alignSelf: "flex-end",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D4246",
    padding: 10,
    marginTop: "97%",
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: '65%',
  },
  noNotificationsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#47ADB8",
  },
  footerText: {
    color: "white",
    fontSize: 12,
  },
});

export default Notifications;
