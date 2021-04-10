const layerStyles = (props) => {
  const { _hover, _focus, _active, baseProps } = props;
  return {
    layerStyles: {
      base: {
        bg: baseProps.bg || 'gray.50',
        border: baseProps.border || '2px solid',
        borderColor: baseProps.borderColor || 'gray.500'
      },
      hover: {
        bg: _hover.bg || 'teal.500',
        color: _hover.color || 'teal.700',
        borderColor: _hover.borderColor || 'orange.500'
      },
      focus: {
        bg: _focus.bg || 'teal.300',
        color: _focus.color || 'teal.500',
        borderColor: _focus.borderColor || 'orange.300'
      },
      active: {
        bg: _active.bg || 'teal.400',
        color: _active.color || 'teal.600',
        borderColor: _active.borderColor || 'orange.400'
      }
    }
  };
};

export default layerStyles;
