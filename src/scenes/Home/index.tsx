import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Text, Textarea, VStack } from '@chakra-ui/react';
import JSON5 from 'json5';
import { axiosGqlQuery, axiosGqlMutation, axiosTest } from '../../api';
import {
  toGraphQLParameterString,
  toGraphQLReturnString,
  buildGraphql,
} from '../../utils';

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
        <Button
          onClick={async () => {
            console.log(JSON5.parse(`{ "'": '"', '{': '', '}': ''}`));
            console.log(JSON5.parse(`{ '[': '', ']': '', ',': ' ', "'": ''}`));
          }}
        >
          Send Mutation
        </Button>
        <Text>
          {JSON5.stringify({
            test1: '123',
            test2: '456',
            test3: '789',
          }).replace(/'|{_|}/g, '"')}
        </Text>
        <Text>
          {toGraphQLParameterString({
            test: '123',
            test2: '456',
            test3: '789',
          })}
        </Text>
        <Text>{toGraphQLReturnString(['test1', 'test2', 'test3'])}</Text>
        <Text>
          {JSON5.stringify(
            buildGraphql(
              'query',
              'User',
              {
                test1: '123',
                test2: '456',
                test3: '789',
              },
              ['test1', 'test2', 'test3'],
            ),
          )}
        </Text>
      </VStack>
    </>
  );
};

export default Home;
