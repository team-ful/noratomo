import {extendTheme, withDefaultColorScheme} from '@chakra-ui/react';
import {StepsStyleConfig as Steps} from 'chakra-ui-steps';

const theme = {
  components: {
    Steps,
    CloseButton: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'orange.400',
      },
    },
    NumberInput: {
      defaultProps: {
        focusBorderColor: 'orange.400',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'orange.400',
      },
    },

    Select: {
      defaultProps: {
        focusBorderColor: 'orange.400',
      },
    },
  },

  styles: {
    global: (props: {colorMode: string}) => ({
      // Chrome
      '&::-webkit-scrollbar': {
        width: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
        borderRadius: '100px',
      },
      // FireFox
      html: {
        scrollbarWidth: 'thin',
        scrollbarColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
      },
    }),
  },
};

export default extendTheme(
  theme,
  withDefaultColorScheme({
    colorScheme: 'orange',
    components: [
      'Button',
      'Checkbox',
      'Switch',
      'Spinner',
      'CircularProgress',
      'Radio',
      'Slider',
      'Select',
      'Tabs',
    ],
  })
);
