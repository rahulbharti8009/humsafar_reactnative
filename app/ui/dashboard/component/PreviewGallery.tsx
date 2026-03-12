import React from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { ImageEntity } from "../../../types/profile.type";
import { SOCKET_URL } from "../../../utils/constant";
import { useTheme } from "../../../theme/ThemeContext";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const IMAGE_SIZE = height * 0.5;

export const PreviewGallery = ({
  images,
  visible,
  onClose,
}: {
  images: ImageEntity[];
  visible: boolean;
  onClose: () => void;
}) => {
      const { theme , themeColor} = useTheme();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
   <SafeAreaProvider>
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: themeColor.black }]}
    > 
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title]}>Gallery</Text>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.close]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery */}
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: `${SOCKET_URL}/${item.uri}` }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

          )}
        />
    </SafeAreaView>
  </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  zoomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  closeBtn: {
    padding: 6,
  },

  close: {
    color: "#fff",
    fontSize: 26,
  },

  listContainer: {
    paddingBottom: 10,
  },

  imageWrapper: {
    marginVertical: 8,
    paddingHorizontal: 0,
  },

  image: {
    width: "100%",
    height: IMAGE_SIZE,
    borderRadius: 14,
  },
});