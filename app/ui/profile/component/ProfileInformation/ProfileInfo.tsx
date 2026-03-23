import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProfileInfoItem } from "./ProfileInfoItem";
import { ProfileEntity } from "../../../../types/profile.type";
import { ProfileAvatar } from "./ProfileAvatar";
import { SOCKET_URL } from "../../../../utils/constant";
import { formatDate, log } from "../../../../utils/helper";

export const ProfileInfo = ({ profile, themeColor }: { profile?: ProfileEntity; themeColor: any }) => {

  return (
 <View style={{justifyContent:'center', alignItems:'center'}}>
               <ProfileAvatar
                      uri={`${profile?.profileImages?.uri}`}
                      themeColor={themeColor.background}
                    />
                <Text style={{ fontSize: 22, fontWeight: "700", color: themeColor.text }}>
                    {profile?.personal?.name}
                </Text>

          <ProfileInfoItem icon="🎂" label="DOB" value={formatDate(profile?.personal?.dob || "")} color={themeColor.text} />

          <ProfileInfoItem icon="📏" label="Height" value={`${profile?.personal?.height} ft`} color={themeColor.text} />

          <ProfileInfoItem icon="👤" label="Age" value={profile?.personal?.age} color={themeColor.text} />

          <ProfileInfoItem icon="📍" label="City" value={profile?.personal?.city} color={themeColor.text} />

          <ProfileInfoItem icon="🎓" label="Education" value={profile?.education} color={themeColor.text} />

          <ProfileInfoItem icon="💼" label="Occupation" value={profile?.job} color={themeColor.text} />

          <ProfileInfoItem icon="💰" label="Income" value={profile?.income} color={themeColor.text} />

               {/* About Section */}
                    <View style={[styles.card, {backgroundColor: themeColor.background}]}>
                      <Text style={[styles.sectionTitle, { color: themeColor.text }]}>
                        About
                      </Text>
            
                      <Text style={[styles.aboutText, { color: themeColor.text }]}>
                        { profile?.about || "No description added"}
                      </Text>
                    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
    aboutText: {
    fontSize: 15,
    lineHeight: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },

  close: {
    fontSize: 26,
    color: "#fff",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    marginHorizontal: 15,
        marginVertical: 10,

    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  tabText: {
    color: "#aaa",
    fontSize: 16,
  },

  activeTab: {
    backgroundColor: "#ff4d6d",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },


  infoCard: {
    padding: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },

  infoText: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 6,
  },

  aboutTitle: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "600",
    color: "#fff",
  },


  imageWrapper: {
    marginVertical: 8,
    paddingHorizontal: 15,
  },

});
