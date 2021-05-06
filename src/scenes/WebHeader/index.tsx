import * as React from 'react';
import { Link as ReactLink, useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  Button,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Logo from '../../components/Logo';
import { useStores } from '../../stores';

type WebHeaderProps = any;

const WebHeader: React.FC<WebHeaderProps> = observer(
  (props: WebHeaderProps): JSX.Element => {
    const { User } = useStores();
    const history = useHistory();

    const { profile } = User.getCurrentUser();

    const renderProfileMenu = () => {
      return (
        <Menu
          offset={[0, 0]}
          preventOverflow
          placement="bottom-end"
          strategy="absolute"
        >
          <MenuButton>
            <Box display="flex" overflow="hidden" marginRight="5px">
              <Avatar
                size="md"
                name={
                  `${profile.firstName} ${profile.lastName}`.length === 0
                    ? `${profile.firstName} ${profile.lastName}`
                    : 'User'
                }
                src={profile.profilePicture}
              />
            </Box>
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuItem onClick={() => history.push('/profile')}>
                <Text>Profile</Text>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  User.logout();
                  history.push('/');
                }}
              >
                <Text>Logout</Text>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      );
    };

    const renderButtonForGuest = () => {
      return (
        <HStack spacing="20px">
          <Button variant="linkHeader" onClick={() => history.push('/login')}>
            Sign In
          </Button>
          <Button
            variant="solid"
            size="lg"
            rounded={{ sm: 'none' }}
            height="51px"
            onClick={() => history.push('/signup')}
          >
            Getting Started
          </Button>
        </HStack>
      );
    };

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
        zIndex="1"
        overflow="hidden"
      >
        <Link href="/">
          <Button variant="unstyled" marginLeft="20px">
            <Logo
              mx="auto"
              h="8"
              iconColor={mode('blue.100', 'blue.100')}
              textColor={mode('gray.200', 'gray.200')}
            />
          </Button>
        </Link>
        <Spacer />
        {User.isAuthenticated ? renderProfileMenu() : renderButtonForGuest()}
      </Flex>
    );
  },
);

export default WebHeader;
