import {
  Box,
  Flex,
  Avatar,
  Center,
  Heading,
  Text,
  Badge,
} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {Shop} from '../../utils/types';
import ShopContent from './ShopContent';

interface EntryForm {
  title: string;
  body: string;
}

interface Props {
  hotppepper: string;
}

const EntryFormByShop: React.FC<Props> = ({hotppepper}) => {
  const [shop, setShop] = React.useState<Shop>();
  const {register, handleSubmit} = useForm<EntryForm>();

  React.useEffect(() => {
    if (typeof shop !== 'undefined') return;

    const f = async () => {
      const res = await fetch(`/api/shop/detail?id=${hotppepper}`);

      if (res.ok) {
        setShop((await res.json()) as Shop);
      }
    };

    f();
  }, []);

  const sumbitHandler: SubmitHandler<EntryForm> = async data => {};

  return (
    <Box>
      <Box
        minH="200px"
        boxShadow="0px 5px 16px -2px #A0AEC0"
        w="100%"
        mb="1.5rem"
        borderRadius="30px"
      >
        {shop ? (
          <Flex w="100%" minH="200px">
            <Center>
              <Avatar size="lg" src={shop.photo.pc.m} mx="1rem" />
            </Center>
            <Box h="100%">
              <Badge mt="2rem">{shop.genre.name}</Badge>
              <Flex alignItems="center">
                <Heading
                  fontSize="1.2rem"
                  mt=".3rem"
                  mr=".5rem"
                  maxWidth="560px"
                >
                  {shop.name}
                </Heading>
              </Flex>

              <Box mr=".1rem" whiteSpace="normal">
                <Text mt=".5rem">{shop.catch}</Text>
                <Text maxW="500px" mt=".2rem" color="gray.500" fontSize=".8rem">
                  {shop.access}
                </Text>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export default EntryFormByShop;
