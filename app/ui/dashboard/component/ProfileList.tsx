import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SOCKET_URL } from "../../../utils/constant";

const data = [
  {
    _id: "1",
    personal: {
      name: "Rahul Bharti",
      height: "5.6",
      religion: "Hindu",
      caste: "Brahmin",
      city: "New Delhi",
    },
    education: "MCA",
    job: "Doctor",
    income: "10-15 LPA",
  },
];

const ProfileCard = ({ item }: any) => {
  return (
    <View style={styles.card}>
      <ImageBackground
          source={
            item?.profileImages
              ? { uri: `${SOCKET_URL}/${item?.profileImages.url}` }
              : require("../../../../assets/ic_profile.png") 
          }    
      style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.overlay}
        >
          <Text style={styles.name}>
            {item.personal.name}, 26
          </Text>

          <Text style={styles.details}>
            {item.job} • {item.education} • {item.personal.city}
          </Text>

          <Text style={styles.tags}>
            {item.personal.height} ft | {item.personal.religion} |{" "}
            {item.personal.caste}
          </Text>

          <Text style={styles.income}>{`Income ${item.income} `}</Text>

        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default function ProfileListScreen({profileList}: any) {
  return (
      <FlatList
        style={{margin: 10}}
        data={profileList}
        keyExtractor={(item, index) => item._id}
        renderItem={({ item }) => <ProfileCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
  },

  image: {
    width: '100%',
    height: 320,
    justifyContent: "flex-end",
  },

  overlay: {
    padding: 16,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  details: {
    color: "#eee",
    fontSize: 14,
    marginTop: 2,
  },

  tags: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 4,
  },

  income: {
    color: "#719b72",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
});