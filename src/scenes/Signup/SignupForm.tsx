import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import CryptoES from 'crypto-es';
import { useStores } from '../../stores';
import PasswordField from '../../components/PasswordField';
import { RoleInput } from '../../stores/User';

const LoginForm: React.FC<any> = (): JSX.Element => {
  const { User } = useStores();
  const [usernameInvalid, setUsernameInvalid] = useState<Record<string, any>>({
    isInvalid: false,
    message: '',
  });
  const [emailInvalid, setEmailInvalid] = useState<Record<string, any>>({
    isInvalid: false,
    message: '',
  });
  const [passwordInvalid, setPasswordInvalid] = useState<Record<string, any>>({
    isInvalid: false,
    message: '',
  });
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState<
    Record<string, any>
  >({
    isInvalid: false,
    message: '',
  });
  const [passwordState, setPasswordState] = useState('');

  const [isUsernameInputLoading, setIsUsernameInputLoading] = useState(false);
  const [isEmailInputLoading, setIsEmailInputLoading] = useState(false);
  const [isPasswordInputLoading, setIsPasswordInputLoading] = useState(false);
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const history = useHistory();

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

  const handlePasswordOnBlur = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const password = e.target.value;
    setPasswordState(password);
    if (password.length === 0) {
      setPasswordInvalid({
        ...passwordInvalid,
        isInvalid: false,
      });
      return;
    }
    setIsPasswordInputLoading(true);
    const validity = await User.validatePassword({ password }, [
      'isInvalid',
      'message',
    ]);
    setPasswordInvalid(validity);
    setIsPasswordInputLoading(false);
  };

  useEffect(() => {
    const confirmPassword = confirmPasswordRef.current;
    if (confirmPassword) {
      if (confirmPassword.value.localeCompare(passwordState) === 0) {
        setConfirmPasswordInvalid({
          ...confirmPasswordInvalid,
          isInvalid: false,
        });
      } else if (confirmPassword.value.length !== 0) {
        setConfirmPasswordInvalid({
          isInvalid: true,
          message: "Confirm password doesn't match with the password",
        });
      }
    }
  }, [passwordState]);

  const handleConfirmPasswordOnBlur = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const confirmPassword = e.target.value;
    console.log('pass', confirmPassword, passwordState);
    if (confirmPassword.length === 0) {
      setConfirmPasswordInvalid({
        ...confirmPasswordInvalid,
        isInvalid: false,
      });
      return;
    }
    if (confirmPassword.localeCompare(passwordState) !== 0) {
      setConfirmPasswordInvalid({
        isInvalid: true,
        message: "Confirm password doesn't match with the password",
      });
      return;
    }
    setConfirmPasswordInvalid({
      ...confirmPasswordInvalid,
      isInvalid: false,
    });
  };

  const submitToast = useToast();
  // React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // your login logic here
    if (
      !usernameInvalid.isInvalid &&
      !emailInvalid.isInvalid &&
      !passwordInvalid.isInvalid &&
      !confirmPasswordInvalid.isInvalid
    ) {
      // TODO
      // setIsSubmitButtonLoading(true);
      const target = e.target as typeof e.target & {
        username: { value: string };
        email: { value: string };
        password: { value: string };
        confirmpassword: { value: string };
      };
      const username = target.username.value;
      const email = target.email.value;
      const password = target.password.value;
      try {
        const { from, to } = await User.signup(
          {
            data: {
              username,
              email,
              password,
              role: RoleInput.user,
              profile: {
                firstName: '',
                lastName: '',
                sex: '',
                profilePicture: '',
              },
            },
          },
          [
            { from: ['userId', 'username', 'email', 'role'] },
            {
              to: [
                'profileId',
                'firstName',
                'lastName',
                'sex',
                'profilePicture',
              ],
            },
          ],
        );
        await User.login({
          email,
          password,
        });
        User.setCurrentUser({
          ...from,
          profile: {
            ...to,
          },
        });
        history.push('/');
      } catch (error) {
        console.error(error);
        return submitToast({
          title: 'Signup error.',
          description: 'Something went wrong while trying to signup',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      return submitToast({
        title: 'Signup error.',
        description: 'One or more fields is invalid',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    return Promise.resolve();
  };

  return (
    <form onSubmit={async (e) => handleSubmit(e)}>
      <Stack spacing="4">
        <FormControl id="username" isInvalid={usernameInvalid.isInvalid}>
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <Input
              rounded={{ sm: 'none' }}
              name="username"
              type="text"
              required
              onBlur={async (e) => handleUsernameOnBlur(e)}
            />
            {isUsernameInputLoading && (
              <InputRightElement>
                <Spinner size="sm" color="teal.400" />
              </InputRightElement>
            )}
          </InputGroup>
          <FormErrorMessage marginLeft="16px">
            {usernameInvalid.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="email" isInvalid={emailInvalid.isInvalid}>
          <FormLabel>Email address</FormLabel>
          <InputGroup>
            <Input
              rounded={{ sm: 'none' }}
              borderButtom="2px"
              name="email"
              type="email"
              autoComplete="email"
              required
              onBlur={async (e) => handleEmailOnBlur(e)}
            />
            {isEmailInputLoading && (
              <InputRightElement>
                <Spinner size="sm" color="teal.400" />
              </InputRightElement>
            )}
          </InputGroup>
          <FormErrorMessage marginLeft="16px">
            {emailInvalid.message}
          </FormErrorMessage>
        </FormControl>
        <PasswordField
          formLabel="Password"
          isRegisterForm
          ref={passwordRef}
          isInvalid={passwordInvalid.isInvalid}
          invalidMessage={passwordInvalid.message}
          onBlur={async (e) => handlePasswordOnBlur(e)}
          isLoading={isPasswordInputLoading}
        />
        <PasswordField
          formLabel="Confirm Password"
          isRegisterForm
          ref={confirmPasswordRef}
          isInvalid={confirmPasswordInvalid.isInvalid}
          invalidMessage={confirmPasswordInvalid.message}
          onBlur={async (e) => handleConfirmPasswordOnBlur(e)}
        />
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          isLoading={isSubmitButtonLoading}
        >
          Sign up
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
