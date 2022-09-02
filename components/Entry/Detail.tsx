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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  UnorderedList,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import {GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api';
import router, {useRouter} from 'next/router';
import React from 'react';
import useSWR from 'swr';
import {parseGender, parseElapsedDate, parseDate} from '../../utils/parse';
import {fetcher} from '../../utils/swr';
import {Application, EntryDetail} from '../../utils/types';

export const Detail = () => {
  const [entryId, setEntryId] = React.useState<number>();
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query['entry_id'] === 'string') {
      setEntryId(parseInt(router.query['entry_id']));
    }
  }, [router.query, router.isReady]);

  return (
    <>{typeof entryId === 'number' && <DetailEntry entryId={entryId} />}</>
  );
};

export const DetailEntry: React.FC<{entryId: number}> = ({entryId}) => {
  const {data, error} = useSWR<EntryDetail, string>(
    `/api/entry/detail?entry_id=${entryId}`,
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
        {data.is_matched && (
          <Text fontWeight="bold" color="red.500" mt="1rem" textAlign="center">
            ※ この募集はすでにマッチが成立しています
          </Text>
        )}
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
              <Text fontSize="1.5rem" fontWeight="bold">
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
            <Button
              w="100%"
              variant="outline"
              as={Link}
              href={`https://www.hotpepper.jp/str${data.shop.hotpepper_id}`}
              isExternal
            >
              ホットペッパー
            </Button>
          </Stack>
        </Box>
        <Divider my="1.5rem" />
        <Box>
          <Heading fontSize="1.7rem">募集タイトル</Heading>
          <Text fontSize="1.5rem" mt=".5rem">
            {data.title}
          </Text>
          {data.body && (
            <>
              <Heading fontSize="1.7rem" mt="1rem">
                募集詳細
              </Heading>
              <Text
                fontSize="1.5rem"
                mt=".5rem"
                whiteSpace="pre-wrap"
                maxW="500px"
              >
                {data.body}
              </Text>
            </>
          )}
          <Heading fontSize="1.7rem" mt="1rem">
            いいねした人
          </Heading>
          <Box>
            <ApplicationUserTable
              applications={data.applications}
              entryId={data.id}
              isMatched={data.is_matched}
            />
          </Box>
        </Box>
      </Box>
    </Center>
  );
};

const ApplicationUserTable: React.FC<{
  applications: Application[];
  entryId: number;
  isMatched: boolean;
}> = ({applications, entryId, isMatched}) => {
  const [currentApplication, setCurrentApplication] =
    React.useState<Application>();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();

  const openModal = (application: Application) => {
    setCurrentApplication(application);
    onOpen();
  };

  const onMatch = (application_id: number) => {
    const f = async () => {
      const form = new FormData();
      form.append('entry_id', String(entryId));
      form.append('application_id', String(application_id));

      const res = await fetch('/api/match', {method: 'POST', body: form});

      if (res.ok) {
        toast({
          status: 'success',
          title: 'マッチを作成しました',
        });
        router.replace('/profile');
      } else {
        toast({
          status: 'error',
          title: 'マッチ作成に失敗しました',
          description: await res.text(),
        });
      }
    };

    f();
  };

  return (
    <>
      <TableContainer mt="1rem">
        <Table>
          <Thead>
            <Tr>
              <Th>日時</Th>
              <Th></Th>
              <Th>ユーザ名</Th>
              <Th>表示名</Th>
              <Th>詳細</Th>
            </Tr>
          </Thead>
          <Tbody>
            {applications.map(v => (
              <ApplicationUser
                application={v}
                onMatch={onMatch}
                key={v.id}
                openModal={openModal}
                isMatched={isMatched}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentApplication?.user.user_name} の詳細</ModalHeader>
          <ModalCloseButton size="lg" />
          <ModalBody>
            <Center>
              <Avatar src={currentApplication?.user.avatar_url} size="lg" />
            </Center>
            <Text
              fontWeight="bold"
              textAlign="center"
              mt=".5rem"
              fontSize="1.3rem"
            >
              {currentApplication?.user.display_name ?? '[未設定]'}
            </Text>
            <Text fontWeight="bold" textAlign="center" mt=".5rem">
              id:{currentApplication?.user.user_name}
            </Text>
            <Divider my="1rem" />
            <Text as="pre">{currentApplication?.user.profile}</Text>
            <UnorderedList>
              <ListItem>
                性別: {parseGender(currentApplication?.user.gender ?? 0)}
              </ListItem>
              <ListItem>年齢: {currentApplication?.user.age} 歳</ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter>
            {!isMatched && (
              <Button
                onClick={() => onMatch(currentApplication?.id || NaN)}
                variant="outline"
              >
                この人と一緒に行く
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ApplicationUser: React.FC<{
  application: Application;
  openModal: (applicaion: Application) => void;
  onMatch: (application_id: number) => void;
  isMatched: boolean;
}> = ({application, openModal, onMatch, isMatched}) => {
  const d = new Date(application.apply_date);
  return (
    <Tr>
      <Td>
        <Tooltip
          label={parseDate(d)}
          placement="top"
          borderRadius="10px"
          hasArrow
        >
          {parseElapsedDate(d)}
        </Tooltip>
      </Td>
      <Td>
        <Avatar src={application.user.avatar_url} />
      </Td>
      <Td>{application.user.user_name}</Td>
      <Td>{application.user.display_name ?? <Badge>未設定</Badge>}</Td>
      <Td>
        <Button size="sm" onClick={() => openModal(application)}>
          詳細
        </Button>
      </Td>
      <Td>
        {!isMatched && (
          <Button
            onClick={() => onMatch(application.id)}
            size="sm"
            variant="outline"
          >
            この人と一緒に行く
          </Button>
        )}
      </Td>
    </Tr>
  );
};
