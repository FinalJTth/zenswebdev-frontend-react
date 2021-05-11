import * as React from 'react';
import { useRef } from 'react';
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
  MenuDivider,
  MenuList,
  MenuItem,
  Portal,
  useColorMode,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Logo from '../../components/Logo';
import { useStores } from '../../stores';
import { useWindowSize } from '../../utils';

type WebHeaderProps = any;

const WebHeader: React.FC<WebHeaderProps> = observer(
  (props: WebHeaderProps): JSX.Element => {
    const { User } = useStores();
    const history = useHistory();

    const rightButtonGroupGuest = useRef<HTMLDivElement | null>(null);

    const { colorMode, toggleColorMode } = useColorMode();

    const { profile, ...user } = User.getCurrentUser();

    const [width, height] = useWindowSize();

    const defaultRightButtonWidth = 200;

    const renderProfileMenu = () => {
      return (
        <Menu
          offset={[0, 0]}
          preventOverflow
          placement="bottom-end"
          strategy="absolute"
        >
          <MenuButton
            as={Button}
            variant="profile"
            size="default"
            height="50px"
            rounded="none"
          >
            <Box display="flex" overflow="hidden" alignItems="center">
              <Avatar
                size="md"
                name={
                  `${profile.firstName} ${profile.lastName}`.length === 0
                    ? `${profile.firstName} ${profile.lastName}`
                    : 'User'
                }
                src={profile.profilePicture}
                transition="all 0.2s"
                borderRadius="none"
              />
              {/*
              <Text
                padding="18px"
                fontWeight="semibold"
                color="teal.200"
                fontSize="18px"
              >
                {user.username}
              </Text>
              */}
            </Box>
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuItem onClick={() => history.push('/profile')}>
                <Text>Profile</Text>
              </MenuItem>
              <MenuItem onClick={toggleColorMode}>
                <Text>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Text>
              </MenuItem>
              <MenuDivider />
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

    const responsiveRightButtonGroup = () => {
      if (defaultRightButtonWidth - width <= -328) {
        return (
          <>
            <Button variant="linkHeader" onClick={() => history.push('/login')}>
              Sign In
            </Button>
            <Button
              variant="solid"
              size="lg"
              rounded={{ sm: 'none' }}
              height="51px"
              onClick={() => history.push('/signup')}
              backgroundColor={mode('teal.600', 'teal.900')}
            >
              Getting Started
            </Button>
          </>
        );
      }

      return (
        <>
          <Button
            variant="solid"
            size="lg"
            rounded={{ sm: 'none' }}
            height="51px"
            onClick={() => history.push('/signup')}
            backgroundColor={mode('teal.600', 'teal.900')}
          >
            Getting Started
          </Button>
        </>
      );
    };

    const renderButtonForGuest = () => {
      return (
        <HStack ref={rightButtonGroupGuest} spacing="20px">
          {responsiveRightButtonGroup()}
        </HStack>
      );
    };

    return (
      <Flex
        top="0"
        minW="100%"
        h="50px"
        minHeight="50px"
        backgroundColor={mode('teal.700', 'teal.1000')}
        borderBottomWidth="2px"
        borderColor={mode('blue.600', 'blue.900')}
        boxShadow="lg"
        position="sticky"
        alignItems="center"
        zIndex="1"
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
