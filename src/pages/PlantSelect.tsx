import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import Header from "../components/Header";
import EnviromentButton from "../components/EnviromentButton";
import PlantCardPrimary from "../components/PlantCardPrimary";
import Load from "../components/Load";
import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnviromentProps {
  key: string;
  title: string;
}

export interface PlantProps {
  id: number;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

export function PlantSelect() {
  const nav = useNavigation();

  const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [enviromentSelected, setEnviromentSelected] = useState("All");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  function handleEnviromentSelection(env: string) {
    setEnviromentSelected(env);

    if (env === "All") return setFilteredPlants(plants);

    const filtered = plants.filter((plant) => plant.environments.includes(env));
    setFilteredPlants(filtered);
  }

  async function fetchPlants() {
    const { data } = await api.get<PlantProps[]>(
      `plants?_sort=title&_order=asc&_page=${page}&_limit=8`
    );

    if (!data) {
      console.error("Error getting data from function `fetchPlants`:", data);
      setLoading(false);
      return;
    }

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleLoadingMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    nav.navigate("PlantSave", { plant });
  }

  useEffect(() => {
    (async function fetchEnviroment() {
      const { data } = await api.get<EnviromentProps[]>(
        "plants_environments?_sort=title&_order=asc"
      );

      if (!data) {
        console.error(
          "Error getting data from function `fetchEnviroment`:",
          data
        );
        return;
      }

      setEnviroments([
        {
          key: "All",
          title: "Todos",
        },
        ...data,
      ]);
    })();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) return <Load />;
  else
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header />

          <Text style={styles.title}>Em qual ambiente</Text>
          <Text style={styles.subTitle}>você quer colocar sua planta</Text>
        </View>

        <View>
          <FlatList
            data={enviroments}
            keyExtractor={(item) => String(item.key)}
            renderItem={({ item }) => (
              <EnviromentButton
                title={item.title}
                active={item.key === enviromentSelected}
                onPress={() => handleEnviromentSelection(item.key)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.enviromentList}
            scrollEnabled={true}
            bounces={true}
            alwaysBounceHorizontal={true}
          />
        </View>

        <View style={styles.plants}>
          <FlatList
            data={filteredPlants}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardPrimary
                data={item}
                onPress={() => handlePlantSelect(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={styles.contentContainerStyle}
            onEndReachedThreshold={0.1}
            onEndReached={({ distanceFromEnd }) =>
              handleLoadingMore(distanceFromEnd)
            }
            ListFooterComponent={
              loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
            }
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 20,
  },
  subTitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  enviromentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  contentContainerStyle: {},
});
