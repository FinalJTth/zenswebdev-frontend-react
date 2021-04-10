import React from 'react';
/*
import logo from './logo.svg';
*/
import './App.css';
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react';
import {
  BrowserRouter,
  Route,
  Switch,
  Link as ReactLink,
  useHistory
} from 'react-router-dom';
import Theme from './themes';
import Home from './scenes/Home';
import Login from './scenes/Login';
import WebHeader from './scenes/WebHeader';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

const Router: React.FC<any> = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

const App: React.FC<any> = (): JSX.Element => {
  return (
    <ChakraProvider theme={Theme}>
      <WebHeader />
      <Box height="calc(100vh - 50px)">
        <Router />
      </Box>
    </ChakraProvider>
  );
};

export default App;
