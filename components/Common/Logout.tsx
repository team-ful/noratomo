import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useSetRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const Logout: React.FC<Props> = ({onClose, isOpen}) => {
  const toast = useToast();
  const router = useRouter();
  const setUser = useSetRecoilState(UserState);

  const [load, setLoad] = React.useState(false);

  const logoutHandler = () => {
    const f = async () => {
      setLoad(true);
      const res = await fetch('/api/logout', {method: 'GET'});

      setLoad(false);

      if (res.ok) {
        toast({
          status: 'info',
          title: 'ログアウトしました',
        });
        onClose();

        setUser(null);
        router.replace('/');
      } else {
        toast({
          status: 'error',
          title: 'ログアウトできませんでした',
          description: await res.text(),
        });
      }
    };

    f();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ログアウトしますか？</ModalHeader>
        <ModalCloseButton size="lg" />
        <ModalBody>
          再度ログインすることで、また使用できるようになります。
        </ModalBody>

        <ModalFooter>
          <Button onClick={logoutHandler} isLoading={load}>
            ログアウト
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Logout;
