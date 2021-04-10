import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import * as React from 'react';
import PasswordField from './PasswordField';

const LoginForm: React.FC<any> = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // your login logic here
      }}
    >
      <Stack spacing="6">
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input name="email" type="email" autoComplete="email" required />
        </FormControl>
        <PasswordField />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign in
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
