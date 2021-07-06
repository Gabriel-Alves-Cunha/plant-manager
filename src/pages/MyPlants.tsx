import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";

import { PlantProps } from "./PlantSelect";
import { loadPlant, removePlant } from "../libs/storage";
import PlantCardSecondary from "../components/PlantCardSecondary";
import Header from "../components/Header";
import Load from "../components/Load";

import waterdropImg from "../assets/waterdrop.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert("Remover", `Deseja remover a ${plant.name}`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😢",
        onPress: async () => {
          await removePlant(plant.id);

          setMyPlants((oldData) =>
            oldData.filter((item) => item.id !== plant.id)
          );
        },
      },
    ]);
  }

  useEffect(() => {
    (async function loadStorageData() {
      let storagedPlants: PlantProps[];
      try {
        storagedPlants = await loadPlant();
      } catch (error) {
        return new Error(error);
      }
      if (storagedPlants.length === 0) {
        Alert.alert("There are no storaged Plants");
        return;
      }
      console.log("HEEEYY storagedPlants = ", storagedPlants);

      const nextTime = formatDistance(
        new Date(storagedPlants[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatered(
        `Não esqueça de regar a ${storagedPlants[0].name} às ${nextTime}h.`
      );

      setMyPlants(storagedPlants);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdropImg} style={styles.spotlightImg} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Text>
              <PlantCardSecondary
                data={item}
                handleRemove={() => handleRemove(item)}
              />
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImg: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
