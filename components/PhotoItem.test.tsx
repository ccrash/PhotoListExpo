import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

const mockDispatch = jest.fn()
const mockUseStoreSelector = jest.fn()
const mockToggleLike = jest.fn((id: string) => ({ type: 'photos/toggleLike', payload: id }))
const mockCalcImageHeight = jest.fn((w: number, h: number) => 240)

jest.mock('@hooks/store', () => ({
  useStoreDispatch: () => mockDispatch,
  useStoreSelector: (fn: any) => mockUseStoreSelector(fn)
}))

jest.mock('@store/photosSlice', () => ({
  toggleLike: (id: string) => mockToggleLike(id),
  toggleLikeAndCache: (id: string) => mockToggleLike(id),
  selectIsLiked: (id: string) => (_state: any) => false
}))

jest.mock('@theme/ThemeProvider', () => ({
  useTheme: () => ({
    scheme: 'light',
    colors: { primary: 'tomato', card: 'white', text: 'black' },
    spacing: (n: number) => 4 * n
  })
}))

jest.mock('@d11/react-native-fast-image')

jest.mock('@utils/image', () => ({
  screenWidth: 360,
  calcImageHeight: (w: number, h: number) => mockCalcImageHeight(w, h)
}))


import PhotoItem from './PhotoItem'

const makePhoto = (overrides: Partial<any> = {}) => ({
  id: 'p1',
  author: 'Alice',
  width: 1000,
  height: 500,
  download_url: 'https://example.com/photo.jpg',
  url: 'https://example.com/photo.jpg',
  ...overrides
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('PhotoItem', () => {
  it('shows loader before image load, hides after onLoadEnd, and renders caption', () => {
    mockUseStoreSelector.mockReturnValue(false)

    const photo = makePhoto()
    const { getByLabelText, queryByLabelText, getByText } = render(<PhotoItem photo={photo} />)

    expect(getByText(`by ${photo.author}`)).toBeTruthy()

    const loader = getByLabelText('Loading image')
    expect(loader).toBeTruthy()

    const img = getByLabelText(`Photo by ${photo.author}`)
    fireEvent(img, 'loadEnd')
    expect(queryByLabelText('Loading image')).toBeNull()
  })

  it('computes image height via calcImageHeight', () => {
    mockUseStoreSelector.mockReturnValue(false)
    const photo = makePhoto({ width: 1200, height: 800 })

    const { getByLabelText } = render(<PhotoItem photo={photo} />)
    const img = getByLabelText(`Photo by ${photo.author}`)

    const styleArray = Array.isArray(img.props.style) ? img.props.style : [img.props.style]
    const merged = Object.assign({}, ...styleArray)

    expect(mockCalcImageHeight).toHaveBeenCalledWith(1200, 800)
    expect(merged.height).toBe(240)
  })

  it('unliked state: accessibility + heart fill is white', () => {
    mockUseStoreSelector.mockReturnValue(false)
    const photo = makePhoto()

    const { getByLabelText, getByTestId } = render(<PhotoItem photo={photo} />)

    const btn = getByLabelText(`Like photo by ${photo.author}`)
    expect(btn.props.accessibilityState?.selected).toBe(false)

    const heart = getByTestId('heart')
    expect(heart.props.fill).toBe('#ffffff')
  })

  it('liked state: accessibility + heart fill is theme primary', () => {
    mockUseStoreSelector.mockReturnValue(true)
    const photo = makePhoto()

    const { getByLabelText, getByTestId } = render(<PhotoItem photo={photo} />)

    const btn = getByLabelText(`Unlike photo by ${photo.author}`)
    expect(btn.props.accessibilityState?.selected).toBe(true)

    const heart = getByTestId('heart')
    expect(heart.props.fill).toBe('tomato')
  })

  it('dispatches toggleLike(photo.id) when pressing the like button', () => {
    mockUseStoreSelector.mockReturnValue(false)
    const photo = makePhoto()

    const { getByLabelText } = render(<PhotoItem photo={photo} />)
    const btn = getByLabelText(`Like photo by ${photo.author}`)

    fireEvent.press(btn)

    expect(mockToggleLike).toHaveBeenCalledTimes(1)
    expect(mockToggleLike).toHaveBeenCalledWith(photo.id)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'photos/toggleLike',
      payload: photo.id
    })
  })
})
