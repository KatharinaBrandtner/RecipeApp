import React from 'react';
import { ThemeProvider } from './components/ThemeContext';  // Achte darauf, dass du den richtigen Pfad verwendest
import { Slot } from 'expo-router';  // Wenn du expo-router verwendest

export default function App() {
  return (
    <ThemeProvider>  {/* ThemeProvider hier einsetzen */}
      <Slot />
    </ThemeProvider>
  );
}
