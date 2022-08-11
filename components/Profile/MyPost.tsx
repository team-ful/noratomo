import {
  Center,
  Box,
  useToast,
  Flex,
  Badge,
  Heading,
  Avatar,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import {parseElapsedDate} from '../../utils/parse';
import {Entry} from '../../utils/types';

const MyPost = () => {
  const toast = useToast();

  const [entries, setEntries] = React.useState<Entry[] | null>(null);

  React.useEffect(() => {
    const f = async () => {
      const res = await fetch('/api/entry');

      if (res.ok) {
        const e = (await res.json()) as Entry[];
        setEntries(e.reverse());
      } else {
        toast({
          status: 'error',
          title: '募集を取得できませんでした',
          description: await res.text(),
        });
      }
    };

    f();
  }, []);

  return (
    <Box mt="2rem" mx={{base: '.5rem', md: '0'}}>
      {entries === null ? (
        <></>
      ) : (
        <>
          {entries.map(v => {
            return <EntryContent entry={v} key={v.id} />;
          })}
        </>
      )}
    </Box>
  );
};

const EntryContent: React.FC<{entry: Entry}> = ({entry}) => {
  return (
    <Box
      minH="200px"
      boxShadow="0px 5px 16px -2px #A0AEC0"
      w="100%"
      mb="1.5rem"
      borderRadius="30px"
    >
      <Flex w="100%" minH="180px" pr=".5rem">
        <Center>
          <Avatar size="lg" src={entry.shop.photo_url || ''} mx="1rem" />
        </Center>
        <Box>
          <Badge mt="2rem">{entry.shop.genre_name}</Badge>
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
            <Text mt=".5rem" as="pre" whiteSpace="pre-wrap" maxW="500px">
              {entry.body}
            </Text>
          </Box>
        </Box>
      </Flex>
      <Text
        textAlign="right"
        mr="2rem"
        color="gray.500"
        fontSize=".8rem"
        pb=".5rem"
      >
        {parseElapsedDate(new Date(entry.date))}
      </Text>
    </Box>
  );
};

export default MyPost;
