import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import * as React from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Merge } from '../../utils';

type OtherProps = {
  formLabel?: string;
  isRegisterForm?: boolean;
  isInvalid?: boolean;
  invalidMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

interface IPasswordFieldProps extends Merge<InputProps, OtherProps> {} // okay

const PasswordField = React.forwardRef<HTMLInputElement, IPasswordFieldProps>(
  (props: IPasswordFieldProps, ref): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);

    const onClickReveal = () => {
      onToggle();
      const input = inputRef.current;
      if (input) {
        input.focus({ preventScroll: true });
        const length = input.value.length * 2;
        requestAnimationFrame(() => {
          input.setSelectionRange(length, length);
        });
      }
    };

    return (
      <FormControl
        id={
          props.formLabel
            ? props.formLabel.substring(0, 1).toLowerCase() +
              props.formLabel.toLowerCase().replace(' ', '')
            : 'password'
        }
        isInvalid={props.isInvalid}
      >
        <Flex justify="space-between">
          <FormLabel>{props.formLabel}</FormLabel>
          {!props.isRegisterForm && (
            <Box
              as="a"
              color={mode('blue.600', 'blue.200')}
              fontWeight="semibold"
              fontSize="sm"
            >
              Forgot Password?
            </Box>
          )}
        </Flex>
        <InputGroup>
          <InputRightElement>
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            rounded={{ sm: 'none' }}
            ref={mergeRef}
            name={
              props.formLabel
                ? props.formLabel.toLowerCase().replace(' ', '')
                : 'password'
            }
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            onBlur={props.onBlur}
          />
        </InputGroup>
        <FormErrorMessage marginLeft="16px">
          {!props.isRegisterForm
            ? 'Password is incorrect'
            : props.invalidMessage}
        </FormErrorMessage>
      </FormControl>
    );
  },
);

PasswordField.displayName = 'PasswordField';
PasswordField.defaultProps = {
  isRegisterForm: false,
  isInvalid: false,
};

export default PasswordField;
