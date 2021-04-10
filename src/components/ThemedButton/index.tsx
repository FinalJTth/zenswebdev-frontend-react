const ThemedButtonStyle = {
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'md'
  },

  sizes: {
    noPadding: {},
    sm: {
      fontSize: '12px',
      px: '10px'
    },
    md: {
      fontSize: '16px',
      px: '15px'
    },
    lg: {
      fontSize: '20px',
      px: '20px'
    },
    solidlg: {
      fontSize: '20px',
      px: '20px',
      h: '45px'
    },
    solidmd: {
      fontSize: '16px',
      px: '15px',
      h: '35px'
    },
    solidxl: {
      fontSize: '30px',
      px: '25px',
      h: '55px'
    }
  },

  variants: {
    outline: {
      bg: '#4299E1',
      border: '2px solid',
      borderColor: '#90AFDF',
      color: 'white'
    },
    solid: {
      bg: '#4299E1',
      color: 'white'
    },

    homepageButton: {
      fontWeight: 'bold',
      bg: '#3182CE',
      color: 'white'
    },

    plainText: {
      fontWeight: 'normal',
      _hover: { fontWeight: 'semibold', textDecoration: 'underline' }
    },

    transparent: {
      color: 'white'
    }
  },
  // The default size and variant values
  defaultProps: {
    size: 'solidmd',
    variant: 'solid'
  }
};

export default ThemedButtonStyle;
