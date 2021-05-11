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
import SearchBox from './SearchBox';

const UserControlPanel: React.FC = observer(() => {
  return (
    <>
      <Box
        maxW={{ sm: 'md', md: 'lg', lg: 'xl' }}
        mt={10}
        mx={{ sm: 'auto' }}
        w={{ sm: 'full' }}
      >
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
            User information
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
            Search and change any user&apos;s information
          </Text>
          <SearchBox />
        </Box>
      </Box>
    </>
  );
});

export default UserControlPanel;
