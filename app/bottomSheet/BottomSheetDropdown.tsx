import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ListRenderItem,
  Platform,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

const { height } = Dimensions.get("window");

export interface DropdownItem {
  label: string;
  value: string;
}

interface BottomSheetDropdownProps {
  label: string;
  placeholder: string;
  data: DropdownItem[];
  value: string | null;
  onSelect: (value: string) => void;
}

const BottomSheetDropdown: React.FC<BottomSheetDropdownProps> = ({
  label,
  placeholder,
  data,
  value,
  onSelect,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
    const { theme , themeColor} = useTheme();

  const slideAnim = useRef(new Animated.Value(height)).current;

  const openSheet = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * (Platform.OS === "ios" ? 0.4 : 0.33),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      setSearch("");
    });
  };

const filteredData = data.filter((item) =>
  item.label
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\//g, "")
    .includes(
      search
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\//g, "")
    )
);

  const renderItem: ListRenderItem<DropdownItem> = ({ item }) => (
    <TouchableOpacity
      style={[styles.item,{backgroundColor: themeColor.inputBackground, borderColor: themeColor.inputBorder}]}
      onPress={() => {
        onSelect(item.value);
        closeSheet();
      }}
    >
      <Text style={[styles.itemText,{color: themeColor.text}]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Input Field */}
      <View style={{ marginBottom: 20 }}>
        {/* <Text style={styles.label}>{label}</Text> */}

        <TouchableOpacity style={[styles.inputBox,{backgroundColor: themeColor.inputBackground, borderColor: themeColor.inputBorder}]} onPress={openSheet}>
          <Text style={{ color: value ? themeColor.text : themeColor.placeholder }}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal transparent visible={visible} animationType="none">
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.bottomSheet, { top: slideAnim, backgroundColor: themeColor.inputBackground }]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={styles.handle} />

              <Text style={[styles.title,{color: themeColor.text}]}>Select {label}</Text>

              <TextInput
                placeholder={`Search ${label}`}
                placeholderTextColor={themeColor.placeholder}
                style={[styles.searchInput,{backgroundColor: themeColor.inputBackground, borderColor: themeColor.inputBorder, color: themeColor.text, }]}
                value={search}
                onChangeText={setSearch}
              />

              <FlatList
                data={filteredData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </Modal>
    </>
  );
};

export default BottomSheetDropdown;

const styles = StyleSheet.create({

  inputBox: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.6,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
});