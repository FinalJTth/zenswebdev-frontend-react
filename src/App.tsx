import React from 'react';
import './App.css';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Theme from './themes';
import WebHeader from './scenes/WebHeader';
import Router from './Router';

const App: React.FC<any> = (): JSX.Element => {
  return (
    <ChakraProvider theme={Theme}>
      <WebHeader />
      <Box height="calc(100vh - 50px)" id="scroller">
        <Router />
      </Box>
    </ChakraProvider>
  );
};

export default App;
