import {Box, Center, Stack, Tooltip} from '@chakra-ui/react';
import {RiSearchLine} from 'react-icons/ri';

const IconSearch = ({
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
      <Stack width={size} spacing={0}>
        <RiSearchLine size="35px" />
        <Center>
          <Box fontSize=".5rem" color="gray">
            {iName}
          </Box>
        </Center>
      </Stack>
    </Tooltip>
  );
};
export default IconSearch;
