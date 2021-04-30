import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import CryptoES from 'crypto-es';
import { useStores } from '../../stores';
import PasswordField from '../../components/PasswordField';

const LoginForm: React.FC<any> = (): JSX.Element => {
  const { User } = useStores();
  const [usernameInvalid, setUsernameInvalid] = useState({
    isInvalid: false,
    message: '',
  });
  const [emailInvalid, setEmailInvalid] = useState({
    isInvalid: false,
    message: '',
  });
  const [passwordInvalid, setPasswordInvalid] = useState({
    isInvalid: false,
    message: '',
  });
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState({
    isInvalid: false,
    message: '',
  });
  const [passwordState, setPasswordState] = useState('');

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

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
    /*
    if (!/^[a-z]/i.test(username)) {
      setUsernameInvalid({
        isInvalid: true,
        message: 'Username must start with a letter',
      });
      return;
    }
    if (!/^[a-z]{0,}\d*$/i.test(username)) {
      setUsernameInvalid({
        isInvalid: true,
        message: 'Username contains implicit characters',
      });
      return;
    }
    if (!/^[a-z]{8,30}\d*$/i.test(username)) {
      setUsernameInvalid({
        isInvalid: true,
        message: 'Username must be between 8 - 30 characters',
      });
      return;
    }
    /*
    if (!/^(?=.*[0-9]).+$/.test(username)) {
      setUsernameInvalid({
        isInvalid: true,
        message: 'Username must contains at least one or more number',
      });
      return;
    }
    */
    const validity = await User.validateUsername({ username }, [
      'isInvalid',
      'message',
    ]);
    setUsernameInvalid(validity);
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
    const validity = await User.validateEmail({ email }, [
      'isInvalid',
      'message',
    ]);
    setEmailInvalid(validity);
  };

  const handlePasswordOnBlur = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const password = e.target.value;
    /*
    console.log('KEY', AES_SECRET);
    const encrypted = CryptoES.AES.encrypt(password, AES_SECRET);
    console.log('ENCRYPTED', encrypted);
    */
    setPasswordState(password);
    if (password.length === 0) {
      setPasswordInvalid({
        ...passwordInvalid,
        isInvalid: false,
      });
      return;
    }
    const validity = await User.validatePassword({ password }, [
      'isInvalid',
      'message',
    ]);
    setPasswordInvalid(validity);
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

  const handleConfirmPasswordInvalidOnBlur = async (
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

  return (
    <form
      onSubmit={(e: Record<string, any>) => {
        e.preventDefault();
        // your login logic here
        if (
          !usernameInvalid.isInvalid &&
          !emailInvalid.isInvalid &&
          !passwordInvalid.isInvalid &&
          !confirmPasswordInvalid.isInvalid
        ) {
          // TODO
        }
      }}
    >
      <Stack spacing="4">
        <FormControl id="username" isInvalid={usernameInvalid.isInvalid}>
          <FormLabel>Username</FormLabel>
          <Input
            rounded={{ sm: 'none' }}
            name="username"
            type="text"
            required
            onBlur={async (e) => handleUsernameOnBlur(e)}
          />
          <FormErrorMessage marginLeft="16px">
            {usernameInvalid.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="email" isInvalid={emailInvalid.isInvalid}>
          <FormLabel>Email address</FormLabel>
          <Input
            rounded={{ sm: 'none' }}
            borderButtom="2px"
            name="email"
            type="email"
            autoComplete="email"
            required
            onBlur={async (e) => handleEmailOnBlur(e)}
          />
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
        />
        <PasswordField
          formLabel="Confirm Password"
          isRegisterForm
          ref={confirmPasswordRef}
          isInvalid={confirmPasswordInvalid.isInvalid}
          invalidMessage={confirmPasswordInvalid.message}
          onBlur={async (e) => handleConfirmPasswordInvalidOnBlur(e)}
        />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign up
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
