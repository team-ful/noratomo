import {
  Center,
  Box,
  Flex,
  Badge,
  Heading,
  Avatar,
  Text,
  Image,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {AiOutlineHeart} from 'react-icons/ai';
import useSWR from 'swr';
import {parseDate, parseElapsedDate} from '../../utils/parse';
import {fetcher} from '../../utils/swr';
import {Entry} from '../../utils/types';

const MyPost = () => {
  const {data, error} = useSWR<Entry[], string>('/api/entry', fetcher<Entry[]>);

  if (error) {
    return <>{error}</>;
  }

  return (
    <Box mt="2rem" mx={{base: '.5rem', md: '0'}}>
      {typeof data === 'undefined' ? (
        <></>
      ) : (
        <>
          {data.length === 0 ? (
            <Center>
              <Box>
                <Heading
                  textAlign="center"
                  fontSize="1.5rem"
                  color="orange.500"
                >
                  募集がありません
                </Heading>
                <Image
                  src="https://storage.googleapis.com/noratomo/contents/empry.png"
                  width="500px"
                  alt="empty"
                />
              </Box>
            </Center>
          ) : (
            data.reverse().map(v => {
              return <EntryContent entry={v} key={v.id} />;
            })
          )}
        </>
      )}
    </Box>
  );
};

const EntryContent: React.FC<{entry: Entry}> = ({entry}) => {
  return (
    <NextLink href={`/entry/detail?entry_id=${entry.id}`} passHref>
      <Box
        minH="200px"
        boxShadow="0px 5px 16px -2px #A0AEC0"
        w="100%"
        mb="1.5rem"
        borderRadius="30px"
        cursor="pointer"
        bgColor={entry.is_matched ? 'gray.300' : 'white'}
      >
        <Flex w="100%" minH="180px" pr=".5rem">
          <Center>
            <Avatar size="lg" src={entry.shop.photo_url || ''} mx="1rem" />
          </Center>
          <Box>
            <Badge mt="2rem" bgColor={entry.is_matched ? 'gray.400' : ''}>
              {entry.shop.genre_name}
            </Badge>
            <Badge
              ml=".5rem"
              mt="2rem"
              bgColor={entry.is_matched ? 'gray.400' : ''}
            >
              {parseDate(new Date(entry.meet_date), true)}
            </Badge>
            <Flex alignItems="center">
              <Heading fontSize="1.2rem" mt=".3rem" mr=".5rem" maxWidth="560px">
                {entry.title}
              </Heading>
            </Flex>

            <Box mr=".1rem" whiteSpace="normal">
              <Text
                maxW="500px"
                mt=".2rem"
                color="gray.500"
                fontSize=".8rem"
                mr=".2rem"
              >
                {entry.shop.name}・{entry.shop.address}
              </Text>
              <Text mt=".5rem" whiteSpace="pre-wrap" maxW="500px">
                {entry.body}
              </Text>
            </Box>
          </Box>
        </Flex>
        <Flex justifyContent="right" alignItems="center" pb=".5rem">
          <Flex mr="1rem" alignItems="center">
            <AiOutlineHeart />
            <Text color="gray.500" fontSize=".8rem" ml=".2rem">
              {entry.request_people ?? '-'}
            </Text>
          </Flex>
          <Text textAlign="right" mr="2rem" color="gray.500" fontSize=".8rem">
            {parseElapsedDate(new Date(entry.date))}
          </Text>
        </Flex>
      </Box>
    </NextLink>
  );
};

export default MyPost;
