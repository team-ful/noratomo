import {Box} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';

const IconPost = ({size}: {size: string}) => {
  return (
    <Box width={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        enableBackground="new 0 0 16 16"
        viewBox="0 0 16 16"
      >
        <style>
          {
            '.st0{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}'
          }
        </style>
        <g id="レイヤー_1">
          <path
            d="M3.9 11.3c0-1.8 1.8-4 4.1-4s4.1 2.2 4.1 4-1.8 2-4.1 2-4.1-.2-4.1-2z"
            className="st0"
          />
          <circle cx="2.4" cy="7.4" r="1.5" className="st0" />
          <circle cx="5.6" cy="4.3" r="1.5" className="st0" />
          <circle cx="13.6" cy="7.3" r="1.5" className="st0" />
          <circle cx="10.3" cy="4.2" r="1.5" className="st0" />
        </g>
        <path
          id="レイヤー_2"
          d="M14.5 11.9h-1.7v-1.7c0-.4-.3-.6-.6-.6s-.6.3-.6.6v1.7H9.8c-.4 0-.6.3-.6.6s.3.6.6.6h1.7v1.7c0 .4.3.6.6.6s.6-.3.6-.6v-1.7h1.7c.4 0 .6-.3.6-.6s-.2-.6-.5-.6z"
          stroke="#fff"
          strokeWidth=".5"
          strokeMiterlimit="10"
        />
      </svg>
    </Box>
  );
};
export default IconPost;
