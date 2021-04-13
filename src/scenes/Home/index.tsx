import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Text, Textarea, VStack } from '@chakra-ui/react';
import { axiosGqlQuery, axiosGqlMutation, axiosTest } from '../../api';

type HomeProps = {
  test: string;
};

const Home: React.FC<HomeProps> = (props: HomeProps): JSX.Element => {
  const { test } = props;
  const [query, setQuery] = useState('');
  const [mutation, setMutation] = useState('');
  const [state, setState] = useState({
    query: '',
    mutation: '',
  });
  return (
    <>
      <VStack>
        <Box>
          <Button
            onClick={async () => {
              const queryObject = await axiosGqlQuery(query);
              console.log('TEST ', queryObject);
              console.log('TEST 2', state.query);
              setState({
                ...state,
                query: JSON.stringify(queryObject),
              });
            }}
          >
            Send Query
          </Button>
          <Textarea onChange={(e) => setQuery(e.target.value)} />
          <Text>{state.query}</Text>
        </Box>
        <Box>
          <Button
            onClick={async () => {
              setState({
                ...state,
                mutation: JSON.stringify(axiosGqlQuery(mutation)),
              });
            }}
          >
            Send Mutation
          </Button>
          <Textarea onChange={(e) => setMutation(e.target.value)} />
          <Text>{state.mutation}</Text>
        </Box>
        <Button onClick={async () => axiosTest()}>Send Mutation</Button>
      </VStack>
    </>
  );
};

export default Home;
