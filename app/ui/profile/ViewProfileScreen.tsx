import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { postApi } from "../../types/genericType";
import { ProfileEntity } from "../../types/profile.type";
import { ENDPOINT } from "../../api/endpoint";
import { SOCKET_URL } from "../../utils/constant";
import { formatDate } from "../../utils/helper";
import { ProfileAvatar } from "./component/ProfileInformation/ProfileAvatar";
import { useTheme } from "../../theme/ThemeContext";

type Props = {
  route: {
    params: {
      email: string;
    };
  };
};

export const ViewProfileScreen = ({ route }: Props) => {
  const { email } = route.params;
  const {themeColor} = useTheme()

  const [isLoading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileEntity | null>(null);

  const profileDetailsApi = async () => {
    try {
      const payload = { email };

      const res = await postApi<ProfileEntity, any>(
        ENDPOINT.PROFILE.PROFILE_DETAILS,
        payload
      );

      if (res.status && res.value) {
        setProfile(res.value);
      }
    } catch (error) {
      console.log("Profile Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profileDetailsApi();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loader}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const p = profile.personal;

  return (
    <View style={{backgroundColor: themeColor.background, flex: 1}}>
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:themeColor.background}]}>
      <ProfileAvatar
        uri={`${profile?.profileImages?.uri}`}
        themeColor={themeColor.background}
      />

      <View style={[styles.card,{backgroundColor: themeColor.card}]}>
        <InfoRow label="Name" value={p?.name} />
        <InfoRow label="Gender" value={p?.gender} />
        <InfoRow label="Age" value={p?.age} />
        <InfoRow label="Date of Birth" value={formatDate(p?.dob)} />
        <InfoRow label="Height" value={`${p?.height} ft`} />
        <InfoRow label="Religion" value={p?.religion} />
        <InfoRow label="Caste" value={p?.caste} />
      
        <InfoRow label="Education" value={profile.education} />
        <InfoRow label="Occupation" value={profile.job} />
        <InfoRow label="Income" value={profile.income} />
        <InfoRow label="Family Income" value={profile.familyIncome} />
        <InfoRow label="State" value={p?.state} />
        <InfoRow label="City" value={p?.city} />
        <InfoRow label="Address" value={p?.address} />
      </View>

      <View style={[styles.card, {backgroundColor:themeColor.background}]}>
        <Text style={[styles.sectionTitle,{color: themeColor.text}]}>About</Text>

        <Text style={[styles.about, {color: themeColor.text}]}>
          {profile?.about || "No description added"}
        </Text>
      </View>
    </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }: any) => {
      const {themeColor} = useTheme()

  if (!value) return null;

  return (
    <View style={styles.row}>
      <Text style={[styles.label,{color: themeColor.text}]}>{label}</Text>
      <Text style={[styles.separator,{color: themeColor.text}]}>:</Text>
      <Text style={[styles.value, {color: themeColor.text}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 10,
  },

  card: {
    width: "100%",
    padding: 18,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 15,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  label: {
    width: 150,
    fontSize: 17,
    fontWeight: "600",
  },

  separator: {
    width: 10,
    fontSize: 17,
  },

  value: {
    flex: 1,
    fontSize: 17,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  about: {
    fontSize: 17,
    lineHeight: 24,
  },
});