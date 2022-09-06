import {
  Center,
  Box,
  Text,
  Heading,
  Stack,
  Avatar,
  Badge,
  Skeleton,
  Button,
  Link,
  Divider,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import {GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api';
import {useRouter} from 'next/router';
import React from 'react';
import useSWR from 'swr';
import {parseDate, parseGender} from '../../utils/parse';
import {fetcher} from '../../utils/swr';
import {ExternalPublicUser, MeetEntry} from '../../utils/types';

export const Meeting = () => {
  const [entryId, setEntryId] = React.useState<number>();
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query['entry_id'] === 'string') {
      setEntryId(parseInt(router.query['entry_id']));
    }
  }, [router.query, router.isReady]);

  return (
    <>{typeof entryId === 'number' && <MeetDetailEntry entryId={entryId} />}</>
  );
};

export const MeetDetailEntry: React.FC<{entryId: number}> = ({entryId}) => {
  const {data, error} = useSWR<MeetEntry, string>(
    `/api/meeting?entry_id=${entryId}`,
    fetcher
  );
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '',
  });

  if (typeof error === 'string') {
    return <>{error}</>;
  }

  if (typeof data === 'undefined') {
    return <></>;
  }

  return (
    <Center>
      <Box mt="2rem" w={{base: '97%', md: '100%'}}>
        <Heading textAlign="center">募集の詳細</Heading>
        <Box>
          <Heading fontSize="1.7rem">相手</Heading>
          <User user={data.partner} />
          <Heading fontSize="1.7rem">募集タイトル</Heading>
          <Text mt=".5rem">{data.title}</Text>
          {data.body && (
            <>
              <Heading fontSize="1.7rem" mt="1rem">
                募集詳細
              </Heading>
              <Text mt=".5rem" whiteSpace="pre-wrap" maxW="500px">
                {data.body}
              </Text>
            </>
          )}
          <Heading fontSize="1.7rem" mt="1rem">
            募集日時、場所
          </Heading>
          <Box>
            <Text
              textAlign="center"
              fontSize="1.4rem"
              fontWeight="600"
              color="orange.500"
              my=".5rem"
            >
              {parseDate(new Date(data.meet_date), true)}
            </Text>
            {isLoaded &&
            typeof data.meeting_lat === 'number' &&
            typeof data.meeting_lon === 'number' ? (
              <GoogleMap
                mapContainerStyle={{width: '100%', height: '500px'}}
                center={{lat: data.meeting_lat, lng: data.meeting_lon}}
                zoom={15}
              >
                <Marker
                  position={{lat: data.meeting_lat, lng: data.meeting_lon}}
                />
              </GoogleMap>
            ) : (
              <Skeleton>
                <Box w="100%" h="500px"></Box>
              </Skeleton>
            )}
          </Box>
          <Button
            w="100%"
            my="1rem"
            variant="outline"
            as={Link}
            href={`https://find.cateiru.com/connect?id=${data.find_id}`}
            isExternal
          >
            find.cateiru.comを使用して待ち合わせる
          </Button>
        </Box>
        <Divider my="1.5rem" />
        <Heading fontSize="1.7rem">お店の情報</Heading>
        <Box>
          <Stack
            direction={{base: 'column', md: 'row'}}
            mt="1.5rem"
            spacing="1rem"
          >
            <Box>
              <Center h="100%">
                <Avatar src={data.shop.photo_url ?? ''} size="xl" />
              </Center>
            </Box>
            <Box textAlign={{base: 'center', md: 'left'}}>
              <Badge>{data.shop.genre_name}</Badge>
              <Text fontSize="1.5rem" fontWeight="bold" maxW="500px">
                {data.shop.name}
              </Text>
              {data.shop.genre_catch && (
                <Text color="gray.600" fontSize=".9rem">
                  {data.shop.genre_catch}
                </Text>
              )}
              <Text color="gray.600" mt="1rem">
                {data.shop.address}
              </Text>
              {data.shop.gender && (
                <Text color="red.500" fontWeight="600">
                  このお店は性別による入場可否があります
                </Text>
              )}
            </Box>
          </Stack>
          <Box mt="1.5rem">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{width: '100%', height: '500px'}}
                center={{lat: data.shop.lat, lng: data.shop.lon}}
                zoom={15}
              >
                <Marker position={{lat: data.shop.lat, lng: data.shop.lon}} />
              </GoogleMap>
            ) : (
              <Skeleton>
                <Box w="100%" h="500px"></Box>
              </Skeleton>
            )}
          </Box>
          <Stack direction={{base: 'column', md: 'row'}} w="100%" mt="1rem">
            <Button w="100%" as={Link} href={data.shop.site_url} isExternal>
              サイトURL
            </Button>
            {data.shop.hotpepper_id && (
              <Button
                w="100%"
                variant="outline"
                as={Link}
                href={`https://www.hotpepper.jp/str${data.shop.hotpepper_id}`}
                isExternal
              >
                ホットペッパー
              </Button>
            )}
          </Stack>
        </Box>
        <Divider my="1.5rem" />
        <Button w="100%" mt="1rem" colorScheme="red">
          TODO: このマッチを終了する
        </Button>
        <Button w="100%" mt="1rem" colorScheme="red" variant="ghost">
          TODO: 相手を報告する
        </Button>
      </Box>
    </Center>
  );
};

const User: React.FC<{user: ExternalPublicUser}> = ({user}) => {
  return (
    <Box mb="1rem">
      <Stack direction={{base: 'column', md: 'row'}} mt="1.5rem" spacing="1rem">
        <Center h="100%">
          <Avatar src={user.avatar_url} size="lg" />
        </Center>
        <Box textAlign={{base: 'center', md: 'left'}}>
          <Text fontSize="1.4rem" fontWeight="bold" ml=".5rem">
            {user.display_name ?? user.user_name}
          </Text>
          <Text>@{user.user_name}</Text>
        </Box>
      </Stack>
      {user.profile && <Text as="pre">{user.profile}</Text>}
      <UnorderedList ml="1.5rem" mt="1rem">
        <ListItem>性別: {parseGender(user.gender ?? 0)}</ListItem>
        <ListItem>
          年齢: {typeof user.age === 'number' ? user.age : '?'} 歳
        </ListItem>
      </UnorderedList>
    </Box>
  );
};
