import {Box, Center, VStack, Tooltip} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';

const IconPost = ({
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
        <RiAddBoxLine size="35px" />
        <Center>
          <Box fontSize=".5rem" color="gray" whiteSpace="nowrap">
            {iName}
          </Box>
        </Center>
      </VStack>
    </Tooltip>
  );
};
export default IconPost;
