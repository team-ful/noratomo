import {
  Avatar,
  Badge,
  Box,
  Center,
  Text,
  Flex,
  Heading,
  Tooltip,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import useSWR from 'swr';
import {parseElapsedDate} from '../../utils/parse';
import {fetcher} from '../../utils/swr';
import {HomeEntry} from '../../utils/types';

const HomePage = () => {
  const {data, error} = useSWR<HomeEntry[], string>(
    '/api/all_entries',
    fetcher
  );

  if (error) {
    return (
      <Text textAlign="center" fontSize="1.5rem" color="red.500">
        {error}
      </Text>
    );
  }

  if (typeof data === 'undefined') {
    return (
      <Center mt="2rem">
        <Spinner size="lg" color="orange.500" />
      </Center>
    );
  }

  return (
    <Box mt="2rem">
      <style>
        {`@keyframes press {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.92);
          }
          to {
            transform: scale(1);
          }
        }`}
      </style>
      {data.map(v => (
        <EntryContent entry={v} key={v.id} />
      ))}
    </Box>
  );
};

const EntryContent: React.FC<{entry: HomeEntry}> = ({entry}) => {
  const [click, setClick] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const f = async (deleteOrAdd: boolean) => {
    let res;
    if (deleteOrAdd) {
      res = await fetch(`/api/request?id=${entry.id}`, {method: 'POST'});
    } else {
      res = await fetch(`/api/request?id=${entry.id}`, {method: 'DELETE'});
    }

    if (!res.ok) {
      console.error(await res.text());
      setClick(false);
    }
  };

  const handleClick = () => {
    if (entry.is_owner) {
      return;
    }

    f(!click);

    setClick(!click);
  };

  return (
    <Tooltip
      hasArrow
      label={
        entry.is_owner
          ? '自分で作成した募集です！'
          : 'タップしてリクエストしよう！'
      }
      placement="left"
      fontSize="1rem"
      borderRadius="10px"
    >
      <Box
        minH="200px"
        boxShadow="0px 5px 16px -2px #A0AEC0"
        w="100%"
        mb="1.5rem"
        borderRadius="30px"
        cursor="pointer"
        _active={{
          animation: 'press 0.2s 1 linear',
        }}
        ref={ref}
        onClick={handleClick}
        transition=".2s"
        bgColor={entry.is_owner ? 'gray.300' : 'white'}
      >
        <Flex w="100%" minH="180px" pr=".5rem">
          <Center>
            <Avatar size="lg" src={entry.shop.photo_url || ''} mx="1rem" />
          </Center>
          <Box>
            <Badge mt="2rem" bgColor={entry.is_owner ? 'gray.400' : ''}>
              {entry.shop.genre_name}
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
            <Box css={click ? {color: '#E53E3E'} : {}}>
              {click ? (
                <AiFillHeart size="20px" />
              ) : (
                <AiOutlineHeart size="20px" />
              )}
            </Box>

            <Text color="gray.500" fontSize=".8rem" ml=".2rem">
              {entry.request_people + (click ? 1 : 0) ?? '-'}
            </Text>
          </Flex>
          <Text textAlign="right" mr="2rem" color="gray.500" fontSize=".8rem">
            {parseElapsedDate(new Date(entry.date))}
          </Text>
        </Flex>
      </Box>
    </Tooltip>
  );
};

export default HomePage;
