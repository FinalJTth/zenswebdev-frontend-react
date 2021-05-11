import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Portal,
  Radio,
  RadioGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spacer,
  Spinner,
  Text,
  Textarea,
  VStack,
  UnorderedList,
  useColorModeValue as mode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { toJS, autorun } from 'mobx';
import { useStores } from '../../stores';
import PasswordField from '../../components/PasswordField';
import { IUser, Role } from '../../stores/User';
import SearchBoxModal from './SearchBoxModal';

const UserControlPanel: React.FC = observer(
  (): JSX.Element => {
    const { User } = useStores();

    const { profile, ...user } = User.getCurrentUser();

    const [modalData, setModalData] = useState<IUser | undefined>();

    let searchResultsLength = 0;

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    let searchTimer: Array<IUser> = [];
    let timer = false;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onChangeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value.length === 0) {
        return;
      }
      const orFilter: Array<Record<string, any>> = [
        {
          username_starts_with: value,
        },
        {
          email_starts_with: value,
        },
      ];
      if (Role[value as keyof typeof Role]) {
        orFilter.push({ role: `enum_${Role[value as keyof typeof Role]}` });
      }
      const searchResult = await User.getUserByQuery(
        {
          filter: {
            OR: orFilter,
          },
          orderBy: 'enum_username_asc',
        },
        [
          'userId',
          'username',
          'email',
          'role',
          {
            profile: [
              'profileId',
              'firstName',
              'lastName',
              'sex',
              'profilePicture',
            ],
          },
        ],
      );
      searchTimer = searchResult;
      if (!timer) {
        timer = true;
        setTimeout(() => {
          User.setSearchInput(value);
          User.setUsersContainer(searchTimer);
          timer = false;
        }, 500);
      }
      /*
    const tsearchResults: any = {};
    User.mapSearchResultByField(value);
    Object.entries(User.mapSearchResultByField(value)).forEach(
      ([key, value2]) => {
        const proxyToJsValue2 = value2.map((value3) => {
          return toJS(value3);
        });
        tsearchResults[key] = proxyToJsValue2;
      },
    );
    setSearchResults(tsearchResults);
    */
    };

    const searchResults = User.mapSearchResultByField();
    console.log(searchResults);

    return (
      <HStack spacing={8}>
        {searchResults && (
          <Popover
            initialFocusRef={searchInputRef}
            placement="bottom-start"
            isLazy
          >
            <PopoverTrigger>
              <Input
                ref={searchInputRef}
                mt={5}
                name="password"
                type="text"
                autoComplete="current-password"
                required
                size="sm"
                onChange={onChangeSearch}
                width="80%"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold">Search result</PopoverHeader>
              <PopoverArrow />
              <PopoverBody>
                {Object.entries(searchResults).map(
                  ([category, results]: Array<any>) => {
                    if (results.length === 0) {
                      return <></>;
                    }
                    searchResultsLength += results.length;
                    return (
                      <>
                        <Divider mt={2} mb={2} />
                        <Heading
                          ml={2}
                          textAlign="left"
                          size="sm"
                          fontWeight="semibold"
                        >
                          {category.substring(0, 1).toUpperCase() +
                            category.substring(1)}
                        </Heading>
                        <Divider mt={2} mb={2} />
                        <VStack align="left">
                          {results &&
                            results.map((result: IUser) => {
                              return (
                                <HStack
                                  as="button"
                                  align="left"
                                  onClick={() => {
                                    setModalData(result);
                                    onOpen();
                                  }}
                                >
                                  <Avatar
                                    name={
                                      `${result.profile.firstName} ${result.profile.lastName}`
                                        .length === 0
                                        ? `${result.profile.firstName} ${result.profile.lastName}`
                                        : result.username
                                    }
                                    src={result.profile.profilePicture}
                                  />
                                  <VStack align="left" width="80%">
                                    <Flex align="left" minWidth="100%">
                                      <Text>{result.username}</Text>
                                      <Spacer />
                                      <Text
                                        color={mode('black', 'gray.500')}
                                        fontSize="sm"
                                      >
                                        {result.role
                                          .substring(0, 1)
                                          .toUpperCase() +
                                          result.role.substring(1)}
                                      </Text>
                                    </Flex>
                                    <Text
                                      color={mode('black', 'gray.500')}
                                      width="100%"
                                      fontSize="sm"
                                      lineHeight="2px"
                                      align="left"
                                    >
                                      {result.email}
                                    </Text>
                                  </VStack>
                                </HStack>
                              );
                            })}
                        </VStack>
                      </>
                    );
                  },
                )}
                {searchResultsLength === 0 && (
                  <Text align="center" color="gray.500">
                    No results found
                  </Text>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        <Box width="100%" />
        <SearchBoxModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          items={modalData}
        />
      </HStack>
    );
  },
);

export default UserControlPanel;
