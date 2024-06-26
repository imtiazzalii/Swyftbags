import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LogBox,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

const Carousel = () => {
  const flatlistRef = useRef();
  // Get Dimensions
  const screenWidth = Dimensions.get("window").width;
  const imageAspectRatio = 16 / 9;
  const imageHeight = screenWidth / imageAspectRatio;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto Scroll

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatlistRef.current.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        flatlistRef.current.scrollToIndex({
          index: activeIndex + 1,
          animation: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  });

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
    index: index,
  });
  // Data for carousel
  const carouselData = [
    {
      id: "01",
      image: require("../assets/carousel/1.png"),
    },
    {
      id: "02",
      image: require("../assets/carousel/2.jpg"),
    },
    {
      id: "03",
      image: require("../assets/carousel/3.jpg"),
    },
  ];

  //  Display Images
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{ height: imageHeight, width: screenWidth  }}
        />
      </View>
    );
  };

  // Handle Scroll
  const handleScroll = (event) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Get the index of current active item

    const index = scrollPosition / screenWidth;

    // Update the index

    setActiveIndex(index);
  };

  // Render Dot Indicators
  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => {
      // if the active index === index

      if (activeIndex === index) {
        return (
          <View
            style={{
              backgroundColor: "#1D4246",
              height: 7,
              width: 7,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
            key={index}
          ></View>
        );
      } else {
        return (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              height: 7,
              width: 7,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
          ></View>
        );
      }
    });
  };

  return (
    <View>
      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        {renderDotIndicators()}
      </View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
