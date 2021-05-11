import * as React from 'react';
import { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Portal,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  VStack,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { useStores } from '../../stores';
import { IUser, Role } from '../../stores/User';

type SearchBoxModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: Function;
  items: IUser | undefined;
};

const SearchBoxModal: React.FC<SearchBoxModalProps> = observer(
  (props: SearchBoxModalProps): JSX.Element => {
    const { isOpen, onClose, items } = props;

    const { User } = useStores();

    const { profile, ...user } = User.getCurrentUser();

    const [usernameInvalid, setUsernameInvalid] = useState<Record<string, any>>(
      {
        isInvalid: false,
        message: '',
      },
    );
    const [emailInvalid, setEmailInvalid] = useState<Record<string, any>>({
      isInvalid: false,
      message: '',
    });
    const [isUsernameInputLoading, setIsUsernameInputLoading] = useState(false);
    const [isEmailInputLoading, setIsEmailInputLoading] = useState(false);

    const initialRef = useRef<any>();
    const finalRef = useRef<any>();

    const handleUsernameOnBlur = async (
      e: React.FocusEvent<HTMLInputElement>,
    ) => {
      const username = e.target.value;
      if (username.length === 0) {
        setUsernameInvalid({
          ...usernameInvalid,
          isInvalid: false,
        });
        return;
      }
      setIsUsernameInputLoading(true);
      const validity = await User.validateUsername({ username }, [
        'isInvalid',
        'message',
      ]);
      setUsernameInvalid(validity);
      setIsUsernameInputLoading(false);
    };

    const handleEmailOnBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      const email = e.target.value;
      if (email.length === 0) {
        setEmailInvalid({
          ...emailInvalid,
          isInvalid: false,
        });
        return;
      }
      setIsEmailInputLoading(true);
      const validity = await User.validateEmail({ email }, [
        'isInvalid',
        'message',
      ]);
      setEmailInvalid(validity);
      setIsEmailInputLoading(false);
    };

    const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>,
      id: Record<string, string>,
    ) => {
      e.preventDefault();
      if ('something') {
        const { userId, profileId } = id;
        const target = e.target as typeof e.target & {
          username: { value: string };
          email: { value: string };
          role: { value: string };
          firstName: { value: string };
          lastName: { value: string };
          sex: { value: string };
          password: { value: string };
        };
        const userData = {
          username: target.username.value,
          email: target.email.value,
          role: `enum_${target.role.value}`,
        };
        if (
          userData.username === user.username &&
          userData.email === user.email &&
          userData.role === user.role
        ) {
          return;
        }
        await User.login({
          email: user.email,
          password: target.password.value,
        }).catch((error) => {
          if (error.message.includes('Email')) {
            // setEmailInvalid(true);
            // isInvalid = true;
            return;
          }
          if (error.message.includes('Password')) {
            // setPasswordInvalid(true);
            // isInvalid = true;
          }
        });
        console.log(target.role.value);
        console.log(userId, profileId);
        User.updateUserByMutation({
          where: {
            userId,
          },
          data: userData,
        }).then((res) => {
          if (res.userId === user.userId) {
            User.login(userData.email);
          }
        });
      }
    };

    return !items ? (
      <></>
    ) : (
      <Portal>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={() => {
            setUsernameInvalid({
              ...usernameInvalid,
              isInvalid: false,
            });
            setEmailInvalid({
              ...emailInvalid,
              isInvalid: false,
            });
            onClose();
          }}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <form
              onSubmit={async (e) => {
                handleSubmit(e, {
                  userId: items.userId,
                  profileId: items.profile.profileId,
                });
              }}
            >
              <ModalHeader>
                <VStack mt={5} align="left" spacing="18px">
                  <Text fontSize="3xl" fontWeight="semibold" lineHeight="0">
                    Edit user information
                  </Text>
                  <Text
                    color={mode('teal.900', 'teal.400')}
                    fontSize="md"
                    fontWeight="normal"
                  >
                    Click on the information to edit
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack width="100%" mt={5} display="flex" align="center">
                  <Avatar
                    ml={5}
                    name={
                      `${items.profile.firstName} ${items.profile.lastName}`
                        .length === 0
                        ? `${items.profile.firstName} ${items.profile.lastName}`
                        : items.username
                    }
                    src={items.profile.profilePicture}
                    size="2xl"
                  />
                  <VStack>
                    <Grid
                      mt={8}
                      templateColumns="repeat(4, 1fr)"
                      templateRows="repeat(6, 1fr)"
                      rowGap={8}
                      columnGap={4}
                      flex="1"
                      minHeight="100%"
                      height="100%"
                      alignItems="center"
                    >
                      <Text align="right">Username :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl
                          id="username"
                          isInvalid={usernameInvalid.isInvalid}
                        >
                          <InputGroup>
                            <Input
                              rounded="none"
                              name="username"
                              type="text"
                              required
                              defaultValue={items.username}
                              onBlur={async (e) => {
                                if (e.target.value === items.username) {
                                  setUsernameInvalid({
                                    ...usernameInvalid,
                                    isInvalid: false,
                                  });
                                  return;
                                }
                                handleUsernameOnBlur(e);
                              }}
                            />
                            {isUsernameInputLoading && (
                              <InputRightElement>
                                <Spinner size="sm" color="teal.400" />
                              </InputRightElement>
                            )}
                          </InputGroup>
                          <FormErrorMessage
                            position="absolute"
                            height="3"
                            marginLeft="16px"
                          >
                            {usernameInvalid.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <Text align="right">Email :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl
                          id="email"
                          isInvalid={emailInvalid.isInvalid}
                        >
                          <InputGroup>
                            <Input
                              rounded={{ sm: 'none' }}
                              borderButtom="2px"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              defaultValue={items.email}
                              onBlur={async (e) => {
                                if (e.target.value === items.email) {
                                  setEmailInvalid({
                                    ...emailInvalid,
                                    isInvalid: false,
                                  });
                                  return;
                                }
                                handleEmailOnBlur(e);
                              }}
                            />
                            {isEmailInputLoading && (
                              <InputRightElement>
                                <Spinner size="sm" color="teal.400" />
                              </InputRightElement>
                            )}
                          </InputGroup>
                          <FormErrorMessage
                            position="absolute"
                            height="3"
                            marginLeft="16px"
                          >
                            {emailInvalid.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <Text align="right">Role :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl as="fieldset" id="role">
                          <RadioGroup defaultValue={items.role} name="role">
                            <HStack>
                              <Radio name="roleUser" value={Role.user}>
                                User
                              </Radio>
                              <Radio name="roleAdmin" value={Role.admin}>
                                Admin
                              </Radio>
                              <Radio name="roleOwner" value={Role.owner}>
                                Owner
                              </Radio>
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <Text align="right">Firstname :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl id="firstName">
                          <Input
                            rounded="none"
                            name="firstName"
                            type="text"
                            defaultValue={items.profile.firstName}
                          />
                        </FormControl>
                      </GridItem>
                      <Text align="right">Lastname :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl name="lastName">
                          <Input
                            rounded="none"
                            name="lastName"
                            type="text"
                            defaultValue={items.profile.lastName}
                          />
                        </FormControl>
                      </GridItem>
                      <Text align="right">Sex :</Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl as="fieldset" id="sex">
                          <RadioGroup
                            defaultValue={items.profile.sex}
                            name="sex"
                          >
                            <HStack>
                              <Radio id="sexMale" name="sexMale" value="male">
                                Male
                              </Radio>
                              <Radio name="sexFemale" value="female">
                                Female
                              </Radio>
                              <Radio name="sexLgbtq" value="lgbtq+">
                                LGBTQ+
                              </Radio>
                              <Radio name="sexOthers" value="others">
                                others
                              </Radio>
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <Text align="right">Password : </Text>
                      <GridItem align="left" colSpan={3}>
                        <FormControl mt="30px" name="lastName" required>
                          <Input
                            rounded="none"
                            name="password"
                            type="password"
                          />
                          <FormHelperText>
                            Input your password to confirm identity
                          </FormHelperText>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </VStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" variant="solid" mt={5}>
                  Save
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Portal>
    );
  },
);

export default SearchBoxModal;
