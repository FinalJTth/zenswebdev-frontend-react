import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  Skeleton,
  Spacer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Tfoot,
} from '@chakra-ui/react';
import JSON5 from 'json5';
import Dropzone, { useDropzone } from 'react-dropzone';
import Promise from 'bluebird';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import * as uuid from 'uuid';
import { addToCart, checkout } from './api';
import {
  axiosGqlQuery,
  axiosGqlMutation,
  axiosTest,
  axiosGqlServiceQuery,
} from '../api';
import {
  toGraphQLParameterString,
  toGraphQLReturnString,
  buildGraphql,
  useStateCallback,
  toBase64,
} from '../utils';
import { useStores } from '../stores';
import { IClassifyPredictionsType } from '../stores/ClassifyModel';
import PredictionsBox from './PredictionsBox';

type PlaygroundProps = {
  test: string;
};

const Playground: React.FC<PlaygroundProps> = observer(
  (props: PlaygroundProps): JSX.Element => {
    const { ClassifyModel } = useStores();
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
                onChange={(e) =>
                  setState({ ...state, modelid: e.target.value })
                }
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

    const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
      // Do something with the files
      const pictures: Array<Record<string, any>> = [];
      const base64pictures = await Promise.all(
        acceptedFiles.map(async (file: File, index: number) => {
          pictures.push({
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(acceptedFiles[index]),
          });
          return toBase64(acceptedFiles[index]);
        }),
      );
      const defaultArray: Array<IClassifyPredictionsType> = Array.from(
        { length: base64pictures.length },
        (current: any, index: number) => {
          return {
            picture: pictures[index],
            predictions: Array.from({ length: 5 }, () => ({
              id: uuid.v4(),
            })),
            isLoading: true,
          };
        },
      );
      ClassifyModel.setDatas(defaultArray);
      Promise.each(base64pictures, async (base64: any, index: number) => {
        const payload = await ClassifyModel.getPredictions(
          { inputImage: base64 },
          [{ predictions: ['id', 'object', 'confident'] }],
        );
        defaultArray[index] = {
          picture: defaultArray[index].picture,
          predictions: payload.predictions,
          isLoading: false,
        };
        ClassifyModel.setDatas(defaultArray);
      });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    const classifyPredictions = ClassifyModel.getDatas();

    enum Role {
      guest = 'enum_owner',
      admin = 'enum_owner',
      owner = 'enum_owner',
    }

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
              {JSON5.stringify(
                buildGraphql(
                  'query',
                  'User',
                  {
                    test1: Role.owner,
                    test2: ['123', 456],
                    test3: '789',
                    test4: {
                      test4_1: {
                        test4_1_1: 123,
                      },
                    },
                  },
                  [
                    { test1: ['test1-1', 'test1-2', 'test1-3'] },
                    'test2',
                    {
                      test3: [
                        'test3-1',
                        'test3-2',
                        { 'test3-3': ['test3-3-1', 'test3-3-2', 'test3-3-3'] },
                        'test3-4',
                      ],
                    },
                  ],
                ),
              )}
            </Text>
            <Box
              as={Button}
              variant="dragndrop"
              maxWidth="400px"
              maxHeight="200px"
              minWidth="400px"
              minHeight="200px"
              width="400px"
              height="200px"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Text noOfLines={2} isTruncated>
                  Drop the files here ...
                </Text>
              ) : (
                <Text noOfLines={2} isTruncated>
                  Drag &apos;n&apos; drop some files here, or click to select
                </Text>
              )}
            </Box>
            <PredictionsBox items={classifyPredictions} />
          </VStack>
        </>
      );
    };

    const [page, setPage] = useState(0);

    return (
      <>
        <Button onClick={() => setPage((page + 1) % 2)}>
          Change Playground
        </Button>
        {page === 0 ? PlaygroundRestAPI() : PlaygroundDefault()}
      </>
    );
  },
);

Playground.displayName = 'Playground';

export default Playground;
