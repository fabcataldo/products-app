import { ThemedText } from '@/presentation/theme/components/themed-text'
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color'
import React from 'react'
import { View } from 'react-native'

const HomeScreen = () => {
  const primary = useThemeColor({}, 'primary')
  return (
    <View style={{
      paddingTop: 100,
      paddingHorizontal: 20
    }}>
      <ThemedText style={{fontFamily: 'KanitBold', color: primary}}>HomeScreen</ThemedText>
      <ThemedText>HomeScreen</ThemedText>
    </View>
  )
}

export default HomeScreen