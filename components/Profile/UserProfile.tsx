import {Box, Avatar, Text, Button, Link} from '@chakra-ui/react';
import NextLink from 'next/link';
import Avater from '../Logo/Avater';
import useUser from '../Session/useUser';

// ユーザーのプロフィールのみを表示
const UserProfile = () => {
  const user = useUser();

  return (
    <Box>
      <Avatar
        size="xl"
        src={user?.avatar_url}
        icon={<Avater size="25px" />}
        boxShadow="10px 10px 30px #A0AEC0B3"
      />
      <Text _before={{content: '"@"'}}>{user?.user_name}</Text>
      <NextLink passHref href={'/setting'}>
        <Link>
          <Button>プロフィール編集</Button>
        </Link>
      </NextLink>
    </Box>
  );
};

export default UserProfile;
