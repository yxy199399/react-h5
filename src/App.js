import React from 'react';
import { StoreProvider } from 'easy-peasy';

import store from './store';
import Routes from './Routes';

const App = props => {
  return (
    <StoreProvider store={store}>
      <Routes />
    </StoreProvider>
  );
};

export default App;
