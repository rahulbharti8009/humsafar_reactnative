import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View , Dimensions, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { getLoginData, getProfileExpData, setProfileData, setProfileExpData } from '../../utils/localDB'
import { User } from '../../types/auth';
import PersonalDetails from './component/AddUpdate/PersonalDetailsComp';
import EducationDetails from './component/AddUpdate/EducationDetailsComp';
import Stepper from './component/AddUpdate/Stepper';
import { useTheme } from '../../theme/ThemeContext';
import ProfileGallery from './component/AddUpdate/ProfileGallery';
import { useAppSelector } from '../../redux/hook/hook';
import { postApi } from '../../types/genericType';
import { ProfileEntity } from '../../types/profile.type';
import { ENDPOINT } from '../../api/endpoint';
import { useDispatch } from 'react-redux';
import { setProfileRedux } from '../../redux/slice/profileSlice';
import NoDataFound from '../../common/NoDataFound';
import { ProfileInfo } from './component/ProfileInformation/ProfileInfo';
const { height } = Dimensions.get("window");
const IMAGE_SIZE = height * 0.35;
export const ProfileScreen = () => {
  const user = useAppSelector((state) => state.auth.user)
  const profile = useAppSelector((state) => state.profile.profile)
  const [activeTab, setActiveTab] = useState<"info" | "edit">("info");


  const [currentStep, setCurrentStep] = React.useState(1);
  const { theme , themeColor} = useTheme();
    const [isLoading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();


  const profileDetailsApi = async () => {
      setLoading(true)
          try {
              const payload  = {
                email: user?.email
              }
                const res = await postApi<ProfileEntity, any>(
                  ENDPOINT.PROFILE.PROFILE_DETAILS,
                  payload 
                );

                if(res.status && res.value) {
                  let profile = res.value
                
                  if(profile?.profileImages && profile?.profileImages?.uri){
                    setCurrentStep(4)
                  } else if(profile?.personal && profile?.personal?.age && profile?.income) {
                     setCurrentStep(3)
                  }  else if(profile?.personal && profile?.personal?.age) {
                     setCurrentStep(2)
                  } else {
                      setCurrentStep(1)
                  }
                    if(res.value?.personal){
                     setProfileData(res.value?.personal)
                    }

                   await setProfileExpData(res.value)
                   dispatch(setProfileRedux(res.value))

                } else{
                  setActiveTab('edit')
                }
              }catch(error){

              }finally{
                 setLoading(false)
              }
          }

  useEffect(()=> {
    profileDetailsApi();
  },[])
  

  if(isLoading) return <NoDataFound/>

  const RenderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetails setCurrentStep={setCurrentStep} />;
      case 2:
        return <EducationDetails setCurrentStep={setCurrentStep} email={user?.email || ""} />;
      case 3:
        return <ProfileGallery currentStep={currentStep} setCurrentStep={setCurrentStep} email={user?.email || ""} />;
        case 4: return <ProfileGallery currentStep={currentStep} setCurrentStep={setCurrentStep} email={user?.email || ""} />;

      default:
        return null;
    }
  };

  return (
  <View style={{flex: 1, backgroundColor: themeColor.background}}>

  {/* Tabs */}
  {profile != null && <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === "info" && {backgroundColor: themeColor.tabBarActive}]}
      onPress={() => setActiveTab("info")}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === "info" && styles.activeTabText,
        ]}
      >
        Information
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.tab, activeTab === "edit" && {backgroundColor: themeColor.tabBarActive}]}
      onPress={() => setActiveTab("edit")}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === "edit" && styles.activeTabText,
        ]}
      >
        Edit
      </Text>
    </TouchableOpacity>
  </View>
}

    {/* INFO TAB */}
    {activeTab === "info" && (
       <View style={styles.infoCard}>
        {profile && <ProfileInfo profile={profile} themeColor={themeColor} />}
        </View>

    )}

    {/* GALLERY TAB */}
    {activeTab === "edit" && <>
     <Stepper currentStep={currentStep} />
     {RenderStepContent()}
    </> }

  </View>
  )
}


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

  profileImage: {
    width: "100%",
    height: IMAGE_SIZE,
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

  image: {
    width: "100%",
    height: IMAGE_SIZE,
    borderRadius: 14,
  },
});
