import {Box, Center, VStack, Tooltip} from '@chakra-ui/react';

const IconChat = ({
  size,
  label,
  iName,
}: {
  size: string;
  label?: string;
  iName?: string;
}) => {
  return (
    <Tooltip label={label}>
      <VStack width={size} spacing={0}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          viewBox="0 0 16 16"
        >
          <style>
            {
              '.st0,.st1{fill:none;stroke:#000;stroke-linecap:round;stroke-miterlimit:10}.st1{stroke-linejoin:round}'
            }
          </style>
          <g id="レイヤー_1">
            <path
              d="M6.6 3.9c1-.1 2-.1 3 0M2.8 11.6c-1-.8-1.6-1.8-1.7-3.1M14.9 8.6c-.1 2.5-2.5 4-4.7 4.5M13.5 5.6c.8.8 1.4 1.8 1.4 3"
              className="st0"
            />
            <path d="M1.1 8.6c0-1 .5-2 1.2-2.7" className="st0" />
            <path
              d="M6.6 3.9C5.2 3 3.9 2 2.4 1c0 1.6 0 2.9-.1 4.9M13.5 5.6c-.1-1.9-.1-2.6-.1-4.7-1.6 1.2-2.2 1.7-3.7 3.1M10.2 13c-.7.5-1.5.9-2.3 1.3-.9.4-1.9.5-2.9.6-1.4.1-3 .1-4.4.1 1.1-1 1.8-1.9 2.2-3.2"
              className="st1"
            />
          </g>
          <g id="レイヤー_2">
            <path
              d="M5.6 6.3V8M10.6 6.3V8M6 9.6c0 .3.2.5.4.7.3.2.7.3 1 .2.3-.1.6-.3.7-.7.4.4.8.8 1.3.8s.9-.5.9-1"
              className="st1"
            />
          </g>
        </svg>
        <Center>
          <Box fontSize=".5rem" color="gray">
            {iName}
          </Box>
        </Center>
      </VStack>
    </Tooltip>
  );
};
export default IconChat;
