import * as React from 'react';
import { Link as ReactLink } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  Button,
  Link,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';

type WebHeaderProps = any;

const WebHeader: React.FC<WebHeaderProps> = (
  props: WebHeaderProps
): JSX.Element => {
  const { test } = props;
  return (
    <Flex
      top="0"
      minW="100%"
      h="50px"
      minHeight="50px"
      bg="teal.700"
      borderBottomWidth="2px"
      borderColor="#2C5282"
      boxShadow="lg"
      position="sticky"
      alignItems="center"
    >
      <Button variant="linkHeader">Home</Button>
      <Link href="/login">
        <Button variant="linkHeader">Login</Button>
      </Link>
    </Flex>
  );
};

export default WebHeader;
