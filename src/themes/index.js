// theme.js
import { extendTheme } from '@chakra-ui/react';
// Global style overrides
import globalStyles from './globalStyle';
// Foundational style overrides
// import borders from './foundations/borders'
// Component style overrides
import Button from './components/button';
import Input from './components/input';

const overrides = {
  styles: {
    globalStyles,
  },
  // borders,
  // Other foundational style overrides go here
  components: {
    Button,
    Input,
    // Other components go here
  },
};

export default extendTheme(overrides);
