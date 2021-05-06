const buttonStyle = {
  baseStyle: (props) => ({
    fontWeight: (props && props.fontWeight) || 'semibold',
    fontSize: props && props.fontSize,
  }),

  sizes: {
    default: {},
    sm: {
      fontSize: '12px',
      px: '10px',
    },
    md: {
      fontSize: '16px',
      px: '15px',
    },
    lg: {
      fontSize: '20px',
      px: '20px',
    },
    xl: {
      fontSize: '24px',
      px: '25px',
    },
    solidsm: {
      fontSize: '16px',
      px: '14px',
      h: '30px',
    },
    solidmd: {
      fontSize: '18px',
      px: '18px',
      h: '36px',
    },
    solidlg: {
      fontSize: '20px',
      px: '22px',
      h: '42px',
    },
    solidxl: {
      fontSize: '22px',
      px: '26px',
      h: '48px',
    },
  },

  variants: {
    outline: {
      border: '1px solid',
      borderColor: 'teal.300',
      color: 'teal.500',
      _hover: { bg: '' },
      _focus: {
        boxShadow:
          '0 0 1px 2px rgba(88, 144, 144, .75), 0 1px 1px rgba(0, 0, 0, .15)',
        bg: 'rgba(178, 245, 234, 0.2)',
        borderColor: 'teal.500',
        borderWidth: '2px',
      },
      _active: {
        bg: 'rgba(129, 230, 217, 0.3)',
      },
    },

    solid: (props) => ({
      bg: props.bg || 'teal.500',
      color: props.color || 'white',
      rounded: props.rounded || { sm: 'md' },
      _hover: { bg: 'teal.600' },
      _focus: {
        boxShadow:
          '0 0 1px 2px rgba(88, 144, 144, .75), 0 1px 1px rgba(0, 0, 0, .15)',
        bg: 'teal.600',
        borderColor: '#bec3c9',
        borderWidth: '0px',
      },
      _active: {
        bg: 'teal.700',
      },
    }),

    ghost: {
      color: 'teal.500',
      _hover: { bg: '' },
      _focus: {
        boxShadow:
          '0 0 1px 2px rgba(88, 144, 144, .75), 0 1px 1px rgba(0, 0, 0, .15)',
        bg: 'rgba(178, 245, 234, 0.1)',
        borderColor: 'teal.500',
        borderWidth: '0px',
      },
      _active: {
        bg: 'rgba(129, 230, 217, 0.3)',
      },
    },

    link: (props) => ({
      fontWeight: (props && props.fontWeight) || 'normal',
      _hover: { fontWeight: 'semibold', textDecoration: 'underline' },
      _focus: {
        boxShadow: '',
      },
    }),

    linkHeader: (props) => ({
      color: 'teal.100',
      fontWeight: (props && props.fontWeight) || 'semibold',
      _hover: {},
      _focus: {
        boxShadow: '',
      },
    }),

    unstyled: (props) => ({
      fontWeight: (props && props.fontWeight) || 'normal',
    }),

    dragndrop: (props) => ({
      backgroundColor: 'teal.200',
      border: '1px',
      borderColor: 'teal.300',
      textColor: 'white',
      fontSize: '18px',
      overflowY: 'auto',
      overflowX: 'hidden',
      align: 'center',
      justify: 'center',
    }),
  },
  // The default size and variant values
  defaultProps: {
    size: 'solidmd',
    variant: 'solid',
  },
};

export default buttonStyle;
