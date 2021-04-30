import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import JSON5 from 'json5';
import { addToCart, checkout } from './api';
import { axiosGqlQuery, axiosGqlMutation, axiosTest } from '../api';
import {
  toGraphQLParameterString,
  toGraphQLReturnString,
  buildGraphql,
} from '../utils';

type PlaygroundProps = {
  test: string;
};

const Playground: React.FC<PlaygroundProps> = (
  props: PlaygroundProps,
): JSX.Element => {
  const { test } = props;
  const [state, setState] = useState({
    shopid: '',
    itemid: '',
    modelid: '',
  });
  const [payloadState, setPayloadState] = useState({
    cartPayload: '',
    checkoutPayload: '',
  });

  const PlaygroundRestAPI = () => {
    return (
      <>
        <VStack>
          <Box>
            <Input
              onChange={(e) => setState({ ...state, shopid: e.target.value })}
            />
            <Input
              onChange={(e) => setState({ ...state, itemid: e.target.value })}
            />
            <Input
              onChange={(e) => setState({ ...state, modelid: e.target.value })}
            />
            <VStack>
              <Box>
                <Button
                  onClick={async () => {
                    const shopId = parseInt(state.shopid, 10);
                    const itemId = parseInt(state.itemid, 10);
                    const modelId =
                      state.modelid.length === 0
                        ? undefined
                        : parseInt(state.modelid, 10);
                    const payload = await addToCart(shopId, itemId, modelId);
                    setPayloadState({
                      ...payloadState,
                      cartPayload: JSON.stringify(payload),
                    });
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={async () => {
                    const shopId = parseInt(state.shopid, 10);
                    const itemId = parseInt(state.itemid, 10);
                    const modelId =
                      state.modelid.length === 0
                        ? undefined
                        : parseInt(state.modelid, 10);
                    const payload = await addToCart(
                      shopId,
                      itemId,
                      modelId,
                    ).then((res) => {
                      return JSON.stringify(res);
                    });
                    setPayloadState({
                      ...payloadState,
                      checkoutPayload: payload,
                    });
                    console.log('CART PAYLOAD :', payload);
                  }}
                >
                  Checkout
                </Button>
              </Box>
              <VStack>
                <Text>{payloadState.cartPayload}</Text>
                <Text>{payloadState.checkoutPayload}</Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </>
    );
  };

  const [query, setQuery] = useState('');
  const [mutation, setMutation] = useState('');
  const [pDefaultState, setPDefaultState] = useState({
    query: '',
    mutation: '',
  });

  const PlaygroundDefault = () => {
    return (
      <>
        <VStack>
          <Box>
            <Button
              onClick={async () => {
                const queryObject = await axiosGqlQuery(query);
                console.log('TEST ', queryObject);
                console.log('TEST 2', pDefaultState.query);
                setPDefaultState({
                  ...pDefaultState,
                  query: JSON.stringify(queryObject),
                });
              }}
            >
              Send Query
            </Button>
            <Textarea onChange={(e) => setQuery(e.target.value)} />
            <Text>{pDefaultState.query}</Text>
          </Box>
          <Box>
            <Button
              onClick={async () => {
                setPDefaultState({
                  ...pDefaultState,
                  mutation: JSON.stringify(axiosGqlQuery(mutation)),
                });
              }}
            >
              Send Mutation
            </Button>
            <Textarea onChange={(e) => setMutation(e.target.value)} />
            <Text>{pDefaultState.mutation}</Text>
          </Box>
          <Button
            onClick={async () => {
              console.log(JSON5.parse(`{ "'": '"', '{': '', '}': ''}`));
              console.log(
                JSON5.parse(`{ '[': '', ']': '', ',': ' ', "'": ''}`),
              );
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

  const [page, setPage] = useState(0);

  return (
    <>
      <Button onClick={() => setPage((page + 1) % 2)}>Change Playground</Button>
      {page === 0 ? PlaygroundRestAPI() : PlaygroundDefault()}
    </>
  );
};

export default Playground;
