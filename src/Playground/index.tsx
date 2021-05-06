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
} from '../utils';
import { useStores } from '../stores';
import { ClassifyPredictionsType } from '../stores/ClassifyModel';

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

    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
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
      const defaultArray: Array<ClassifyPredictionsType> = Array.from(
        { length: base64pictures.length },
        (current: any, index: number) => {
          return {
            picture: pictures[index],
            predictions: [{}, {}, {}, {}, {}],
            isLoading: true,
          };
        },
      );
      ClassifyModel.setPayloads(defaultArray);
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
        ClassifyModel.setPayloads(defaultArray);
      });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    const classifyPredictions = ClassifyModel.getPayloads();

    const renderPredictionBox = () => {
      return classifyPredictions.map(
        (classifyPrediction: ClassifyPredictionsType, index: number) => {
          const { predictions, picture, isLoading } = classifyPrediction;
          return (
            predictions && (
              <VStack
                spacing="0px"
                margin="2px"
                rounded="lg"
                maxWidth="700px"
                minWidth="700px"
                border="1px"
                borderColor="teal.200"
                boxShadow="md"
              >
                <Flex
                  alignItems="left"
                  backgroundColor="teal.100"
                  borderBottom="1px"
                  borderColor="teal.200"
                  width="100%"
                  height="40px"
                >
                  <Text
                    fontFamily="Trebuchet MS"
                    fontSize="16px"
                    paddingLeft="17px"
                    paddingTop="8px"
                    marginBottom="10px"
                    color="teal.600"
                  >
                    Name : {picture.name}
                  </Text>
                  <Spacer />
                  <Text
                    fontFamily="Trebuchet MS"
                    fontSize="16px"
                    paddingLeft="17px"
                    paddingTop="8px"
                    marginBottom="10px"
                    color="teal.600"
                    width="150px"
                  >
                    Size : {Number(picture.size) / 1000} kB
                  </Text>
                </Flex>
                <HStack
                  margin="2px"
                  rounded="lg"
                  maxWidth="700px"
                  minWidth="700px"
                  border="1px"
                  borderTop="0px"
                  borderColor="teal.200"
                  boxShadow="md"
                >
                  <Image
                    src={picture.url}
                    height="224px"
                    width="224px"
                    rounded="lg"
                    borderRight="1px"
                    borderColor="teal.200"
                  />
                  <Box paddingLeft="10px" paddingRight="20px" width="100%">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th fontSize="16px">ID</Th>
                          <Th fontSize="16px">Object</Th>
                          <Th isNumeric fontSize="16px">
                            Confident
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {predictions.map((result: Record<string, any>) => {
                          return (
                            <Tr>
                              <Th
                                width="130px"
                                fontSize="14px"
                                fontWeight="normal"
                              >
                                {isLoading ? (
                                  <Skeleton height="16px" />
                                ) : (
                                  result.id
                                )}
                              </Th>
                              <Th fontSize="14px" fontWeight="normal">
                                {isLoading ? (
                                  <Skeleton height="16px" />
                                ) : (
                                  result.object
                                )}
                              </Th>
                              <Th isNumeric fontSize="14px" fontWeight="normal">
                                {isLoading ? (
                                  <Skeleton height="16px" width="100%" />
                                ) : (
                                  result.confident.toFixed(10)
                                )}
                              </Th>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </HStack>
              </VStack>
            )
          );
        },
      );
    };

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
            {renderPredictionBox()}
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

export default Playground;
