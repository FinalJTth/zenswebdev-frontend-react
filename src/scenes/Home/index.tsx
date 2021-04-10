import * as React from 'react';
import { Button } from '@chakra-ui/react';

type HomeProps = {
  test: string;
};

const Home: React.FC<HomeProps> = (props: HomeProps): JSX.Element => {
  const { test } = props;
  return (
    <>
      <Button>Test</Button>
    </>
  );
};

export default Home;
