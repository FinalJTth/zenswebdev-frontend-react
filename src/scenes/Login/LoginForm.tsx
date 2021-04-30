import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
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
  return (
    <form
      onSubmit={async (e: Record<string, any>) => {
        e.preventDefault();
        // your login logic here
        const payload = await User.login({
          email: e.target.email.value,
          password: e.target.password.value,
        }).catch((error) => {
          if (error.message.includes('Email')) {
            setEmailInvalid(true);
          } else if (error.message.includes('Password')) {
            setPasswordInvalid(true);
          }
        });
      }}
    >
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
