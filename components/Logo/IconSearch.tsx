import {Box} from '@chakra-ui/react';
import {RiSearchLine} from 'react-icons/ri';

const IconSearch = ({size}: {size: string}) => {
  return (
    <Box w={size}>
      <RiSearchLine size="35px" />
    </Box>
  );
};
export default IconSearch;
