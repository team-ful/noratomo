import {Box} from '@chakra-ui/react';
import {RiSearchLine} from 'react-icons/ri';

const IconSearch = ({size}: {size: string}) => {
  return (
    <Box width={size}>
      <RiSearchLine size={size} />
    </Box>
  );
};
export default IconSearch;
