import {Box} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';

const IconPost = ({size}: {size: string}) => {
  return (
    <Box w={size}>
      <RiAddBoxLine size="35px" />
    </Box>
  );
};
export default IconPost;
