import * as React from 'react';
import { AuthProvider } from "./src/contexts/AuthContext";
import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;