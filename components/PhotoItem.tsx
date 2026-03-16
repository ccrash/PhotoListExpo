import React, { useState, useMemo, useCallback, memo } from 'react'
import { ActivityIndicator, Image, Text, View, Pressable, StyleSheet } from 'react-native'
import type { Photo } from '@/types/photo'
import { calcImageHeight, screenWidth } from '@utils/image'
import { useStoreDispatch, useStoreSelector } from '@hooks/store'
import { selectIsLiked, toggleLikeAndCache } from '@store/photosSlice'
import { useTheme } from '@theme/ThemeProvider'
import Heart from '@assets/heart_fill.svg'

type Props = {
  photo: Photo
}

export const PhotoItem = ({ photo }: Props) => {
  const [loaded, setLoaded] = useState(false)
  const height = useMemo(() => calcImageHeight(photo.width, photo.height), [photo.width, photo.height])

  const dispatch = useStoreDispatch()
  const isLiked = useStoreSelector((s: any) => selectIsLiked(photo.id)(s))

  const theme = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const onToggleLike = useCallback(() => {
    dispatch(toggleLikeAndCache(photo.id))
  }, [dispatch, photo.id])

  
  return (
    <View style={styles.card}>
      <View style={[styles.imageWrap, { height }]}>
        {!loaded && <ActivityIndicator accessibilityLabel="Loading image" color={theme.colors.primary} />}
        <Image
          source={{ uri: photo.download_url }}
          style={[styles.image, { height }]}
          resizeMode="cover"
          onLoadEnd={() => setLoaded(true)}
          accessible
          accessibilityLabel={`Photo by ${photo.author}`}
        />
        <Pressable
          onPress={onToggleLike}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ selected: isLiked }}
          accessibilityLabel={`${isLiked ? 'Unlike' : 'Like'} photo by ${photo.author}`}
          android_ripple={{ borderless: true, color: 'rgba(255,255,255,0.25)' }}
          style={styles.likeBtn}
        >
          <Heart
            testID='heart'
            width={32}
            height={32}
            fill={isLiked ? theme.colors.primary : '#ffffff'}
          />
        </Pressable>
      </View>
    </View>
  )

  return (
    <View style={styles.card}>
      <View style={[styles.imageWrap, { height }]}>
        {!loaded && <ActivityIndicator accessibilityLabel="Loading image" color={theme.colors.primary} />}
        <Image
          source={{ uri: photo.download_url }}
          style={[styles.image, { height }]}
          resizeMode="cover"
          onLoadEnd={() => setLoaded(true)}
          accessible
          accessibilityLabel={`Photo by ${photo.author}`}
        />
        <Pressable
          onPress={onToggleLike}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ selected: isLiked }}
          accessibilityLabel={`${isLiked ? 'Unlike' : 'Like'} photo by ${photo.author}`}
          // android_ripple={{ borderless: true, color: 'rgba(255,255,255,0.25)' }}
          style={styles.likeBtn}
        >
          <Heart
            testID='heart'
            width={32}
            height={32}
            fill={isLiked ? theme.colors.primary : '#ffffff'}
          />
        </Pressable>
      </View>

      <Text style={styles.caption}>by {photo.author}</Text>
    </View>
  )
}

const makeStyles = (t: { scheme: 'light' | 'dark'; colors: any; spacing: (n: number) => number }) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colors.card,
      width: '100%'
    },
    imageWrap: {
      width: '100%',
      backgroundColor: t.scheme === 'dark' ? '#1f1f1f' : '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
    },
    image: {
      position: 'absolute',
      width: '100%',
      borderRadius: 6
    },
    likeBtn: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.scheme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.55)',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3
    },
    caption: {
      padding: t.spacing(3),
      color: t.colors.text
    }
  })

export default memo(PhotoItem)
