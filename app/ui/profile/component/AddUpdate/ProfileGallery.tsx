import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../../../theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { getLoginData, getProfileData, getProfileExpData, setLoginSave, setProfileExpData } from "../../../../utils/localDB";
import { ProfileEntity } from "../../../../types/profile.type";
import { incomeList, occupationList } from "../../../../utils/enum";
import { Dropdown } from "react-native-element-dropdown";
import { isValidEmail, log } from "../../../../utils/helper";
import { postApi, uploadProfile } from "../../../../types/genericType";
import { ENDPOINT } from "../../../../api/endpoint";
import { MyCircle } from "../../../../component/MyCircle";
import { Icon } from "../../../../component/ImageComp";
import { openPicker } from "../../../../utils/Camera";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/slice/authSlice";
import { SOCKET_URL } from "../../../../utils/constant";
import { useAppSelector } from "../../../../redux/hook/hook";
import NoDataFound from "../../../../common/NoDataFound";
import { setProfileRedux } from "../../../../redux/slice/profileSlice";

export default function ProfileGallery({ setCurrentStep, email, currentStep }: any) {
    const { theme , themeColor} = useTheme();
    const [image, setImage] = useState<string  | null>(null);
    const dispatch = useDispatch();
      const user = useAppSelector((state) => state.auth.user)
            const profile = useAppSelector((state) => state.profile.profile)

    

  const [form, setForm] = useState<ProfileEntity>({
    profileImages : [],
    gallery: [],
  });

    const [isLoading, setLoading] = useState<boolean>(false);

   const uoload =async () => {
      setLoading(() => true)
    try {

      const payload: any = {
                     email: email
                   }
                   if(form.profileImages[0] !== undefined)
                   payload['profileImages'] = form.profileImages[0]
                   if(form.gallery?.length)
                   payload['galleryImages'] = form.gallery?.map((item) => item.uri) // ✅ FIXED
                   log("",payload)
                  const res =  await uploadProfile(payload);

                 if(res.status) {
                   await setProfileExpData(res.value)
                   const updatedUser = await getLoginData();
                   dispatch(setProfileRedux(res.value))
                   dispatch(login(updatedUser));
                   Alert.alert(res.message)
                  } else {
                    Alert.alert(res.message);
                  }
                }catch(error) {
                  // Alert.alert("",JSON.stringify(error))
                  }
                  finally {
                    setLoading(() => false)
                    setForm(prev => ({...prev, gallery: []}))
                  }
                 }


    const handleDelete =async(fileName = '')=> {
      try{
        setLoading(true)
       const payload = {
            email: user?.email || "",
            fileName: fileName
          }
              const res = await postApi<ProfileEntity, any>(
              ENDPOINT.PROFILE.DELETE_PROFILE_PIC,
              payload 
              );
      
              if(res.status && res.value) {
                  dispatch(setProfileRedux(res.value))
              }
            }catch(error){
              log("",error)
            }finally{
                setLoading(false)
               
            }
    }

    if(isLoading) return <NoDataFound/>

  return (
<View style={[styles.container,{backgroundColor:themeColor.background}]}>
  
  <ScrollView showsVerticalScrollIndicator={false}>
    
    <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>
      
      {/* PROFILE IMAGE */}
      {/* <Text style={[styles.sectionTitle,{color:themeColor.text}]}>
        Profile Photo
      </Text> */}

      <View style={styles.profileWrapper}>
    <View style={{backgroundColor:themeColor.chatSearch, borderRadius: 70, padding: 0, flexDirection:'row', alignItems:'center'}}>

        <MyCircle size={120} color={themeColor.tabBarActive}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              openPicker({
                imageType: "profile",
                callback: (_type: string, uri: string) => {
                  setForm((prev) => ({
                    ...prev,
                    profileImages: [uri],
                  }));
                },
              })
            }
          >
            <Icon
              size={110}
              source={
                form.profileImages?.length
                  ? { uri: form.profileImages[0] }
                  : profile?.profileImages?.uri
                  ? { uri: `${SOCKET_URL}/${profile?.profileImages?.uri}` }
                  : require("../../../../../assets/ic_user.png")
              }

            />
          </TouchableOpacity>
        </MyCircle>

            {/* <TouchableOpacity
            style={{ marginStart: '10%',}}
            activeOpacity={0.8}
            onPress={() =>
              openPicker({
                imageType: "profile",
                callback: (_type: string, uri: string) => {
                  setForm((prev) => ({
                    ...prev,
                    profileImages: [uri],
                  }));
                },
              })
            }
          >
                <Text style={[styles.sectionTitle,{color:themeColor.text, textAlign:'center'}]}>
                  Update
                </Text>
           </TouchableOpacity> */}
        </View>
      </View>


      {/* GALLERY ADD BUTTON */}
      <Text style={[styles.sectionTitle,{color:themeColor.text}]}>
        Gallery
      </Text>

      <View style={styles.galleryAddRow}>

        <TouchableOpacity
          style={[styles.addGalleryBtn,{backgroundColor:themeColor.profileSelecter}]}
          onPress={()=>{
            if(profile?.gallery && profile.gallery?.length <= 2 && profile.gallery?.length != 0){
              Alert.alert('Please delete old gallery photo first')
              return
            }

            if(form.gallery?.length === 2){
              Alert.alert('You can select only 2 photos')
              return
            }

            openPicker({
              imageType:"gallery",
              callback:(_type:string, uri:string)=>{
                setForm(prev=>({
                  ...prev,
                  gallery:[...(prev.gallery || []), {uri}]
                }))
              }
            })
          }}
        >
          <Icon
            size={40}
            tintColor={themeColor.placeholder}
            source={require("../../../../../assets/ic_gallery.png")}
          />
          <Text style={{color:themeColor.placeholder}}>Add Photo</Text>
        </TouchableOpacity>


        {form.gallery?.map((item)=>{
          return(
            <View key={item.uri} style={styles.previewImage}>
              
              <Icon
                radius={10}
                size={100}
                source={{uri:item.uri}}
              />

              <TouchableOpacity
                style={styles.previewDelete}
                onPress={()=>{
                  const updated = form.gallery?.filter(i=>i.uri !== item.uri)
                  setForm({...form, gallery:updated})
                }}
              >
                <Text style={{color:"#fff"}}>X</Text>
              </TouchableOpacity>

            </View>
          )
        })}

      </View>

    </View>


    {/* EXISTING SERVER GALLERY */}
    <View style={styles.galleryWrapper}>
      {profile?.gallery?.map((item)=>{
        return(
          <View style={styles.imageContainer_} key={item.uri}>
            
            <Icon
              style={styles.image}
              source={{uri:`${SOCKET_URL}/${item.uri}`}}
            />

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={()=>handleDelete(item.uri)}
            >
              <Text style={{color:"#fff"}}>✕</Text>
            </TouchableOpacity>

          </View>
        )
      })}
    </View>

  </ScrollView>


  {/* BUTTONS */}
  <View style={styles.bottomButtons}>
    
    <TouchableOpacity
      style={[styles.button,{backgroundColor:themeColor.previous}]}
      onPress={()=>setCurrentStep(2)}
    >
      <Text style={styles.buttonText}>Previous</Text>
    </TouchableOpacity>

    <TouchableOpacity
      disabled={form.profileImages?.length===0 && form.gallery?.length===0}
      style={[
        styles.button,
        {
          backgroundColor:
            form.profileImages?.length===0 && form.gallery?.length===0
              ? themeColor.tabBarInactive
              : themeColor.tabBarActive
        }
      ]}
      onPress={uoload}
    >
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>

  </View>

</View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#ff4d6d",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
    dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
    imageContainer: {
    position: "relative",
    margin: 10,
  },
  galleryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: 10
  },

  imageContainer_: {
    width: "48%", // 3 images per row
    aspectRatio: 1,
    marginBottom: 10,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10
  },

  deleteBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5
  },
  sectionTitle:{
  fontSize:18,
  fontWeight:"600",
  marginBottom:10
},

profileWrapper:{
  alignItems:"center",
},

galleryAddRow:{
  flexDirection:"row",
  flexWrap:"wrap",
  gap:10
},

addGalleryBtn:{
  width:100,
  height:100,
  borderRadius:12,
  justifyContent:"center",
  alignItems:"center"
},

previewImage:{
  position:"relative"
},

previewDelete:{
  position:"absolute",
  top:-5,
  right:-5,
  backgroundColor:"red",
  width:25,
  height:25,
  borderRadius:20,
  justifyContent:"center",
  alignItems:"center"
},

bottomButtons:{
  flexDirection:"row",
  justifyContent:"space-between",
  margin:10
},
});