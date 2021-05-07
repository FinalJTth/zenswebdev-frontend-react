import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PasswordField from '../../components/PasswordField';
import { useStores } from '../../stores';

const LoginForm: React.FC<any> = (): JSX.Element => {
  const { User } = useStores();
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const submitToast = useToast();

  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // your login logic here
    let isInvalid;
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    await User.login({
      email: target.email.value,
      password: target.password.value,
    }).catch((error) => {
      if (error.message.includes('Email')) {
        setEmailInvalid(true);
        isInvalid = true;
      }
      if (error.message.includes('Password')) {
        setPasswordInvalid(true);
        isInvalid = true;
      }
    });
    if (isInvalid) {
      return false;
    }
    try {
      const [user] = await User.getUserByQuery(
        {
          email: target.email.value,
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
      User.setCurrentUser(user);
      history.push('/');
    } catch (error) {
      console.error(error);
      return submitToast({
        title: 'Login error.',
        description: `${error}`,
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
        <FormControl id="email" isInvalid={emailInvalid}>
          <FormLabel>Email address</FormLabel>
          <Input
            rounded={{ sm: 'none' }}
            name="email"
            type="email"
            autoComplete="email"
            required
            onBlur={() => setEmailInvalid(false)}
          />
          <FormErrorMessage marginLeft="16px">
            Email address is incorrect
          </FormErrorMessage>
        </FormControl>
        <PasswordField
          formLabel="Password"
          isInvalid={passwordInvalid}
          onBlur={() => setPasswordInvalid(false)}
        />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign in
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
