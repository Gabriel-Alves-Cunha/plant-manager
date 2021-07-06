import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

import userImg from "../assets/waterdrop.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export default function Header() {
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    (async function loadStorageUserName() {
      try {
        const user = await AsyncStorage.getItem("@plantmanager:user");
        setUserName(user);
      } catch (error) {
        throw new Error("Wasn't able to store user on device!");
      }
    })();
  }, [userName]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image source={userImg} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 28,
    marginTop: 12,
  },
});
