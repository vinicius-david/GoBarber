import React from 'react';

import GlobalStyle from './styles/global';
import { AuthProvider } from './hooks/AuthContext';

import LogIn from './pages/LogIn';
// import Register from './pages/Register';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <LogIn />
    </AuthProvider>

    <GlobalStyle />
  </>
);

export default App;
