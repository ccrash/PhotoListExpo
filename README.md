# Photo List Expo

PhotoListExpo is the porting on Expo of PhotoList (https://github.com/ccrash/PhotoList), a mobile application built with React and Redux that displays a dynamic list of photos.
It allows users to like photos, with their favorites stored persistently using AsyncStorage.
The app also includes a theme switching feature, enabling users to toggle between light and dark modes for a personalized experience.

![plot](./assets/ios_recording.gif)

# Features:

* Cross-platform parity: smooth, consistent UI and behavior on both Android and iOS

* Photo feed (Picsum API): paginated fetch (page, limit, default 8) with HTTP error handling.

* Bottom tabs: “Photos” and “Liked” screens with custom SVG tab icons.

* Theming: light/dark theme tokens, synced with the OS (via Appearance) + a header theme switch; themed NavigationContainer and status bar.

* Photo cards: full-width images with responsive height (calcImageHeight), author caption, and an ActivityIndicator until the image loads.

* Like / Unlike: heart button with visual state (fill color), Android ripple, and accessibility (role, label, selected state).

* Favorites screen: lists the photos you’ve liked.

* State management: Redux store with slice selectors/actions (toggleLike, selectIsLiked) and redux-persist so likes survive app restarts.

* Accessibility basics: labels for images and controls; uses accessibility state and roles.

* Performance touches: memoized styles and computations (useMemo, memo), per-item selector to avoid excess renders.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on iOS or Android

### Steps

**Install dependecies:**

```bash
yarn install
```

**Run the project locally**

```bash
yarn start
```

Scan the QR code displayed in the terminal or browser with Expo Go to launch the app.