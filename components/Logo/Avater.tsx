import {Box} from '@chakra-ui/react';

const Avater = ({size}: {size: string}) => {
  return (
    <Box width={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 16 16"
      >
        <path
          id="レイヤー_2"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth=".5"
          d="M14 12.1V4c0-.1 0-.2-.1-.3-.3-1.1-2.2 1.3-3.1 2.3C6.5 2.1 1 4.9 1 8.7c0 3.4 8 4.3 9.8 1.5 1 1.3 3 3.2 3.2 1.9z"
        />
        <path
          id="レイヤー_3"
          fill="#1c1c1c"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M4.7 6.6v1.1"
        />
      </svg>
    </Box>
  );
};
export default Avater;
