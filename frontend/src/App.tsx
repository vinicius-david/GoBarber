import React from 'react';

import GlobalStyle from './styles/global';
import AppProvider from './hooks';

import LogIn from './pages/LogIn';
// import Register from './pages/Register';

const App: React.FC = () => (
  <>
    <AppProvider>
      <LogIn />
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;
