import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Logo from '@assets/images.svg'
import { useTheme } from '@theme/ThemeProvider'

export default function HeaderTitle() {
  const theme = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  return (
    <View style={styles.wrap} accessibilityRole='header' accessibilityLabel='App header'>
      <Logo width={24} height={24} fill={theme.colors.text} />
      <Text style={styles.text}>PhotoList</Text>
    </View>
  )
}

const makeStyles = (t: any) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' },
    icon: { marginRight: 8 },
    text: { color: t.colors.text, fontSize: 18, fontWeight: '600', marginLeft: 8}
  })
