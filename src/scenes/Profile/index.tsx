import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Portal,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Textarea,
  VStack,
  useColorModeValue as mode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { useStores } from '../../stores';
import UserControlPanel from './UserControlPanel';

const Profile: React.FC = observer(() => {
  const { User } = useStores();
  const [editorImage, setEditorImage] = useState<string | File>();
  const [editorScale, setEditorScale] = useState<number>(5);
  const [editorBorderRadius, setEditorBorderRadius] = useState<number>(0);
  const [testImage, setTestImage] = useState<string>('');

  const editorRef = useRef<any>();
  const initialRef = useRef<any>();
  const finalRef = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
    // Do something with the files
    setEditorImage(acceptedFiles[0]);
    return Promise.resolve();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
  });

  const onClickSave = () => {
    const editor = editorRef.current;
    if (editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = editor.getImage();
      const canvasScaled = editor.getImageScaledToCanvas();

      const canvasURL = canvasScaled.toDataURL();
      fetch(canvasURL)
        .then((res) => res.blob())
        .then((blob) => {
          setTestImage(URL.createObjectURL(blob));
        });
    }
  };

  const { profile, ...user } = User.getCurrentUser();

  const renderModal = () => {
    return (
      <Portal>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack spacing="18px">
                <Text fontSize="25px" fontWeight="semibold">
                  Edit Avatar
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box align="center">
                <Flex
                  mt="8"
                  width={360}
                  height={360}
                  backgroundColor="white"
                  border="2px"
                  borderColor={mode('white', 'gray.600')}
                  shadow="lg"
                  align="center"
                  justify="center"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <AvatarEditor
                    ref={editorRef}
                    image={editorImage || 'http://example.com/initialimage.jpg'}
                    width={256}
                    height={256}
                    border={50}
                    borderRadius={0 + editorBorderRadius * 1.28}
                    scale={1.0 + editorScale / 20}
                  />
                </Flex>
                <HStack spacing={8} mt={8}>
                  <Text
                    color={mode('teal.900', 'teal.400')}
                    fontWeight="semibold"
                    width="140px"
                  >
                    Scale
                  </Text>
                  <Slider
                    aria-label="slider-ex-4"
                    defaultValue={5}
                    onChange={(val) => setEditorScale(val)}
                  >
                    <SliderTrack bg={mode('teal.100', 'teal.300')}>
                      <SliderFilledTrack bg={mode('teal.300', 'teal.600')} />
                    </SliderTrack>
                    <SliderThumb boxSize={5}>
                      <Box color="teal" />
                    </SliderThumb>
                  </Slider>
                </HStack>
                <HStack spacing={8} mt={4}>
                  <Text
                    color={mode('teal.900', 'teal.400')}
                    fontWeight="semibold"
                    width="140px"
                  >
                    Border Radius
                  </Text>
                  <Slider
                    aria-label="slider-ex-4"
                    defaultValue={5}
                    onChange={(val) => setEditorBorderRadius(val)}
                  >
                    <SliderTrack bg={mode('teal.100', 'teal.300')}>
                      <SliderFilledTrack bg={mode('teal.300', 'teal.600')} />
                    </SliderTrack>
                    <SliderThumb boxSize={5}>
                      <Box color="teal" />
                    </SliderThumb>
                  </Slider>
                </HStack>
                <Image
                  mt={8}
                  borderRadius={editorBorderRadius}
                  src={testImage}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button variant="solid" mt={5} onClick={onClickSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Portal>
    );
  };

  return (
    <Box
      bg={mode('gray.50', 'inherit')}
      minH="100%"
      py="12"
      px={{ sm: '6', lg: '8' }}
    >
      <Box
        maxW={{ sm: 'md', md: 'lg', lg: 'xl' }}
        mx={{ sm: 'auto' }}
        w={{ sm: 'full' }}
      >
        <Heading mt="6" textAlign="left" size="md" fontWeight="semibold">
          Account settings
        </Heading>
        <Text
          color={mode('teal.900', 'teal.400')}
          mt="4"
          align="left"
          maxW="md"
          fontWeight="none"
          lineHeight="0"
        >
          Manage your account settings and more
        </Text>
      </Box>
      <Box
        maxW={{ sm: 'md', md: 'lg', lg: 'xl' }}
        mx={{ sm: 'auto' }}
        mt="8"
        w={{ sm: 'full' }}
      >
        <Box
          bg={mode('white', 'gray.700')}
          py="8"
          px={{ base: '4', md: '10' }}
          shadow="base"
        >
          <Heading textAlign="left" size="xs" fontWeight="semibold">
            Name & Profile Picture
          </Heading>
          <Text
            color={mode('teal.900', 'teal.400')}
            fontSize="sm"
            mt="4"
            align="left"
            maxW="md"
            fontWeight="none"
            lineHeight="0"
          >
            Change your name and profile picture
          </Text>
          <HStack spacing={4} mt={8} align="left">
            <Avatar
              size="xl"
              name={
                `${profile.firstName} ${profile.lastName}`.length === 0
                  ? `${profile.firstName} ${profile.lastName}`
                  : user.username
              }
              src={profile.profilePicture}
            />
            <VStack align="left">
              <Text fontSize="15px">{user.username}</Text>
              <Text
                color={mode('teal.900', 'teal.400')}
                fontSize="12px"
                lineHeight="4px"
              >
                {user.role}
              </Text>
            </VStack>
          </HStack>
          <Button
            variant="solid"
            fontWeight="normal"
            size="sm"
            mt={5}
            onClick={onOpen}
          >
            Change name
          </Button>
          <Button
            ml={2}
            variant="solid"
            fontWeight="normal"
            size="sm"
            mt={5}
            onClick={onOpen}
          >
            Change picture
          </Button>
          <Divider mt={5} />
          <Heading mt={5} textAlign="left" size="xs" fontWeight="semibold">
            Login information
          </Heading>
          <Text
            color={mode('teal.900', 'teal.400')}
            fontSize="sm"
            mt="4"
            align="left"
            maxW="md"
            fontWeight="none"
            lineHeight="0"
          >
            Enter your old password to change any information
          </Text>
          <HStack mt={8} align="left" spacing={8}>
            <VStack spacing={3} align="left" width="50%">
              <Text
                color={mode('teal.900', 'teal.400')}
                fontSize="sm"
                maxW="md"
                fontWeight="none"
                lineHeight="0"
              >
                Old password
              </Text>
              <Box>
                <Input
                  name="password"
                  placeholder="Old password"
                  type={isOpen ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  size="sm"
                />
              </Box>
              <Text
                color={mode('teal.900', 'teal.400')}
                fontSize="sm"
                maxW="md"
                fontWeight="none"
                lineHeight="0"
              >
                New password
              </Text>
              <Box>
                <Input
                  name="password"
                  placeholder="New password"
                  type={isOpen ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  size="sm"
                />
                <Input
                  name="confirmpassword"
                  placeholder="Confirm password"
                  type={isOpen ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  borderTop="0"
                  size="sm"
                />
                <Button
                  variant="solid"
                  fontWeight="normal"
                  size="sm"
                  mt={5}
                  onClick={onOpen}
                >
                  Change password
                </Button>
              </Box>
            </VStack>
            <VStack ml={5} align="left" width="60%">
              <Text
                color={mode('teal.900', 'teal.400')}
                fontSize="sm"
                maxW="md"
                fontWeight="none"
                lineHeight="0"
                pb={1}
                mt="88px"
              >
                Email Field
              </Text>
              <Box>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  size="sm"
                  defaultValue={user.email}
                />
                <Button
                  variant="solid"
                  fontWeight="normal"
                  size="sm"
                  mt={5}
                  onClick={onOpen}
                >
                  Change email
                </Button>
              </Box>
            </VStack>
          </HStack>
        </Box>
      </Box>
      {renderModal()}
      <UserControlPanel />
    </Box>
  );
});

export default Profile;
