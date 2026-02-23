import React, { useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { getLoginData } from '../../utils/localDB'
import { User } from '../../types/auth';
import PersonalDetails from './component/PersonalDetailsComp';
import EducationDetails from './component/EducationDetailsComp';
import Stepper from './component/Stepper';
import { useTheme } from '../../theme/ThemeContext';
import ProfileGallery from './component/ProfileGalleryComp';

export const ProfileScreen = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const { theme , themeColor} = useTheme();
  
  useEffect(() => {
    const fetchData = async () => {
      await getLoginData().then(res => {
        setUser(res);
      });
    };
    fetchData();
  }, [])
  const RenderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetails setCurrentStep={setCurrentStep} />;
      case 2:
        return <EducationDetails setCurrentStep={setCurrentStep} email={user?.email || ""} />;
      case 3:
        return <ProfileGallery setCurrentStep={setCurrentStep} email={user?.email || ""} />;
      default:
        return null;
    }
  };
  return (
  <View style={{flex: 1, backgroundColor: themeColor.background}}>
      <Stepper currentStep={currentStep}/>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10}}>
              {RenderStepContent()}
    </ScrollView>
  </View>
  )
}
