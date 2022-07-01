import {Box} from '@chakra-ui/react';

const IconHome = ({size}: {size: string}) => {
  return (
    <Box w={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 16 16"
      >
        <style>
          {
            '.st0{fill:none;stroke:#000;stroke-linecap:round;stroke-miterlimit:10}'
          }
        </style>
        <path
          id="レイヤー_1"
          d="M15.9 7.5c-.1 0-.1 0-.1-.1h-.1.1-.4.1-.2.1-.1.1-.1.1-.2.1-.2v4.8l-6.5 2.6v-4.5h-1v4.5L1 12.1V7.2c-.3.1-.7.3-1 .5v4.4c0 .4.2.8.6.9l7.2 2.9h.4l7.2-2.9c.4-.2.6-.5.6-.9V7.5h-.1z"
        />
        <path
          id="レイヤー_2"
          d="M.5 7.7 8 10.8m7.5-3.1L8 10.8M.5 7.7c1.2-.5.9-.4 2.1-.9m12.9.6c-1.4-.5-1.3-.5-2.6-1"
          className="st0"
        />
        <g id="レイヤー_3">
          <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            d="M3 8.6c-.4-.4-.4-1.1-.4-1.7.1-.8.5-1.6 1-2.3-.1-1.4.1-2.8.8-3.9 0-.1.1-.1.1-.1.1-.1.2 0 .3.1.9.8 1.7 1.7 2 3 .7 0 1.5.2 2.1.5.3-1.4 1-2.3 2-3.1.6.7 1.3 2.9 1.4 3.4.3 1.3.1.8.4 2.1.2 1.2.2 1.4-.3 2.3"
          />
          <path d="M5.6 5.5v1.3m2.8-.6v1.4" className="st0" />
        </g>
      </svg>
    </Box>
  );
};
export default IconHome;
