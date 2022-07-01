import {Box} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';

const IconPost = ({size}: {size: string}) => {
  return (
    <Box width={size}>
      <RiAddBoxLine size={size} />
    </Box>
  );
};
export default IconPost;
