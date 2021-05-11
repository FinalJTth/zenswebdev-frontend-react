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
  StackProps,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Tfoot,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
  IClassifyPredictionsType,
  IPredictionType,
} from '../stores/ClassifyModel';
import { Merge } from '../utils';

type PredictionsBoxProps = {
  items: Array<IClassifyPredictionsType>;
};

interface IPredictionsBoxProps extends Merge<StackProps, PredictionsBoxProps> {}

const PredictionsBox: React.FC<IPredictionsBoxProps> = observer(
  (props: IPredictionsBoxProps): JSX.Element => {
    const { items, ...stackProps } = props;
    return (
      <>
        {items.map((classifyPredictions: IClassifyPredictionsType) => {
          const { predictions, picture, isLoading } = classifyPredictions;
          return (
            predictions && (
              <VStack
                key={`${picture.name}_container`}
                spacing="0px"
                margin="2px"
                rounded="lg"
                maxWidth="700px"
                minWidth="700px"
                border="1px"
                borderColor="teal.200"
                boxShadow="md"
                {...stackProps}
              >
                <Flex
                  key={`${picture.name}_header`}
                  alignItems="left"
                  backgroundColor="teal.100"
                  borderBottom="1px"
                  borderColor="teal.200"
                  width="100%"
                  height="40px"
                >
                  <Text
                    key={`${picture.name}_header_filename`}
                    fontFamily="Trebuchet MS"
                    fontSize="16px"
                    paddingLeft="17px"
                    paddingTop="8px"
                    marginBottom="10px"
                    color="teal.600"
                  >
                    Name : {picture.name}
                  </Text>
                  <Spacer key={`${picture.name}_header_spacer`} />
                  <Text
                    key={`${picture.name}_header_filesize`}
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
                  key={`${picture.name}_body`}
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
                    key={`${picture.name}_image`}
                    src={picture.url}
                    height="224px"
                    width="224px"
                    rounded="lg"
                    borderRight="1px"
                    borderColor="teal.200"
                  />
                  <Box
                    key={`${picture.name}_table_container`}
                    paddingLeft="10px"
                    paddingRight="20px"
                    width="100%"
                  >
                    <Table
                      key={`${picture.name}_table`}
                      variant="simple"
                      size="sm"
                    >
                      <Thead key={`${picture.name}_table_header`}>
                        <Tr key={`${picture.name}_table_header_row`}>
                          <Th
                            key={`${picture.name}_table_header_row_id`}
                            fontSize="16px"
                          >
                            ID
                          </Th>
                          <Th
                            key={`${picture.name}_table_header_row_object`}
                            fontSize="16px"
                          >
                            Object
                          </Th>
                          <Th
                            key={`${picture.name}_table_header_row_confident`}
                            isNumeric
                            fontSize="16px"
                          >
                            Confident
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody key={`${picture.name}_table_body`}>
                        {predictions.map((result: IPredictionType) => {
                          return (
                            <Tr key={`${picture.name}_${result.id}`}>
                              <Th
                                key={`${picture.name}_${result.id}_id`}
                                width="130px"
                                fontSize="14px"
                                fontWeight="normal"
                              >
                                {isLoading ? (
                                  <Skeleton
                                    key={`${picture.name}_${result.id}_skeleton_id`}
                                    height="16px"
                                  />
                                ) : (
                                  result.id
                                )}
                              </Th>
                              <Th
                                key={`${picture.name}_${result.id}_object`}
                                fontSize="14px"
                                fontWeight="normal"
                              >
                                {isLoading ? (
                                  <Skeleton
                                    key={`${picture.name}_${result.id}_skeleton_object`}
                                    height="16px"
                                  />
                                ) : (
                                  result.object
                                )}
                              </Th>
                              <Th
                                key={`${picture.name}_${result.id}_confident`}
                                isNumeric
                                fontSize="14px"
                                fontWeight="normal"
                              >
                                {isLoading ? (
                                  <Skeleton
                                    key={`${picture.name}_${result.id}_skeleton_confident`}
                                    height="16px"
                                    width="100%"
                                  />
                                ) : (
                                  Number(result.confident).toFixed(10)
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
        })}
      </>
    );
  },
);

export default PredictionsBox;
