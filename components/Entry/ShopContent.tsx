import {
  Avatar,
  Box,
  Heading,
  Flex,
  Text,
  Badge,
  Link,
  Center,
} from '@chakra-ui/react';
import {FiExternalLink} from 'react-icons/fi';
import {Shop} from '../../utils/types';

interface Props {
  shop: Shop;
}

const ShopContent: React.FC<Props> = ({shop}) => {
  return (
    <Box
      minH="200px"
      boxShadow="0px 5px 16px -2px #A0AEC0"
      w="100%"
      mb="1.5rem"
      borderRadius="30px"
    >
      <Flex w="100%" minH="200px">
        <Center>
          <Avatar size="lg" src={shop.photo.pc.m} mx="1rem" />
        </Center>
        <Box h="100%">
          <Badge mt="2rem">{shop.genre.name}</Badge>
          <Flex alignItems="center">
            <Heading fontSize="1.2rem" mt=".3rem" mr=".5rem">
              {shop.name}
            </Heading>
            <Link href={shop.urls.pc} isExternal>
              <FiExternalLink size="20px" />
            </Link>
          </Flex>

          <Box mr=".1rem" whiteSpace="normal">
            <Text mt=".5rem">{shop.catch}</Text>
            <Text maxW="500px" mt=".2rem" color="gray.500" fontSize=".8rem">
              {shop.access}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopContent;
