# 📱 MyRecipe App

MyRecipe is a modern mobile app that allows users to search, view, and save cooking recipes. Built with React Native and Expo, the app features a clean modern interface, intuitive navigation, and dynamic data integration via TheMealDB API.

---

## 🌟 Features

- 🔍 **Search Recipes**: Find meals by name, category, or origin (area)
- 📖 **View Recipe Details**: Including ingredients, instructions, and images
- ➕ **Add New Recipe**: Users can manually add their own recipes
- 🌙 **Light/Dark Mode**: Toggleable theme support
- 🧭 **Bottom Tab Navigation**: Seamless switch between screens
- 📱 **Image Overlay**: Tap a recipe image to view in fullscreen

---

## 💻 Tech Stack

- **Frontend Framework**: React Native with TypeScript
- **Navigation**: Expo Router (File-based routing)
- **API**: [TheMealDB](https://www.themealdb.com/api.php)
- **Styling**: Custom themes using `useTheme` and `StyleSheet.create`
- **Development Platform**: Expo Go (for iOS/Android preview)

---

## 🛠️ Installation & Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Start the development server**:

```bash
npx expo start
```

3. **Open in Expo Go** (scan the QR code)

> Make sure to have [Expo Go](https://expo.dev/client) installed on your phone.

---

## ✍️ Add Recipes Locally

- The "New Recipe" screen allows users to input custom recipes via a form.
- Recipes are temporarily stored and displayed under "My Recipes"

---

## 📸 Screenshots 

![Home screen](/readme_images/home.JPEG)
![New recipe](/readme_images/new.jpeg)
![My recipes](/readme_images/my.JPEG)
![Searched recipes](/readme_images/search.JPEG)
![Detail page](/readme_images/detail.JPEG)
