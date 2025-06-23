import { BrowserRouter as Router } from 'react-router-dom';

import '../src/styles/main.scss';
import Header from './components/headers/header';
import AuthProvider from './context/auth-provider';
import Toggle from './components/dark-theme';
import AppRoutes from './app-routs';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  console.log('Redux state:', useSelector(state => state));
const darkMode = useSelector(state => state.mode.darkMode);
console.log('Redux state:', useSelector(state => state));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div >
          <Header />
          <Toggle />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
