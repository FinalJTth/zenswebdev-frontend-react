import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
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
import PasswordField from '../../components/PasswordField';

const UserControlPanel: React.FC = observer(() => {
  const { User } = useStores();

  const editorRef = useRef<any>();

  const { profile, ...user } = User.getCurrentUser();

  return (
    <>
      <Box maxW={{ sm: 'xl' }} mt={10} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
        <Heading mt="6" textAlign="left" size="md" fontWeight="semibold">
          User control panel
        </Heading>
        <Text
          color={mode('teal.900', 'teal.400')}
          mt="4"
          align="left"
          maxW="md"
          fontWeight="none"
          lineHeight="0"
        >
          Since you&apos;re an admin, this is where you manage users
        </Text>
      </Box>
      <Box maxW={{ sm: 'xl' }} mx={{ sm: 'auto' }} mt="8" w={{ sm: 'full' }}>
        <Box
          bg={mode('white', 'gray.700')}
          py="8"
          px={{ base: '4', md: '10' }}
          shadow="base"
        >
          Something
        </Box>
      </Box>
    </>
  );
});

export default UserControlPanel;
