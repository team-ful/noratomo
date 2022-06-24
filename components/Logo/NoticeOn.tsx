import {Box} from '@chakra-ui/react';

const NoticeOn = ({size}: {size: string}) => {
  return (
    <Box width={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 16 16"
      >
        <style>
          {
            '.st0{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}'
          }
        </style>
        <ellipse
          id="レイヤー_1"
          cx="8"
          cy="14.4"
          className="st0"
          rx="1.2"
          ry="1.1"
        />
        <path
          id="レイヤー_2"
          d="M8 13.3c2.1 0 2.6-.1 4.3-.5 1-.2 1.9 1.4.2 2.2-.9.4-1 .5-4.5.5-4.5 0-4.7-.7-5-.8-.8-.6-.3-2.1.7-1.8 1.5.2 2.3.4 4.3.4z"
          className="st0"
        />
        <path
          id="レイヤー_3"
          d="M7 4c.9-.1 1.9 0 2.1 0M14 6.1c.9 3.1.4 5.1-1.2 6.3-1 .8-8.6 1-10.1 0-1.2-.8-1.8-2.9-.6-6.3"
          className="st0"
        />
        <path
          id="レイヤー_4"
          d="M14 6.1 13.8.4m0 0L9.1 4M7 4 2.2.4m0 0-.1 5.7"
          className="st0"
        />
        <g id="レイヤー_5">
          <path d="M10.3 6.3V8M5.7 6.3V8" className="st0" />
          <path
            fill="#fff"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            d="M5.7 9.6c-.9 1 1.8 2.1 2.3.2.5 1.9 3.1.7 2.3-.2"
          />
        </g>
        <circle
          id="レイヤー_6"
          cx="12.6"
          cy="3.9"
          r="2.2"
          fill="red"
          stroke="red"
          strokeMiterlimit="10"
        />
      </svg>
    </Box>
  );
};
export default NoticeOn;
