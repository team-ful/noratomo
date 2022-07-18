import {
  Box,
  Text,
  Flex,
  Heading,
  Button,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useSetRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';

const SettingAccountDanger = () => {
  const router = useRouter();

  const logoutModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [load, setLoad] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);

  const setUser = useSetRecoilState(UserState);

  const logoutHandler = () => {
    const f = async () => {
      setLoad(true);
      await fetch('/api/logout', {method: 'GET'});

      changeLocate();
    };

    f();
  };

  const deleteHandler = () => {
    const f = async () => {
      setLoad(true);
      await fetch('/api/user', {method: 'DELETE'});

      changeLocate();
    };

    f();
  };

  const changeLocate = () => {
    setLoad(false);
    logoutModal.onClose();
    setUser(null);
    router.replace('/');
  };

  return (
    <>
      <Box mt="3rem">
        <Heading mb="2rem" fontSize="1.5rem">
          その他
        </Heading>
        <Flex alignItems="center">
          <Text>ログアウト</Text>
          <Spacer />
          <Button colorScheme="gray" onClick={logoutModal.onOpen}>
            ログアウト
          </Button>
        </Flex>
        <Flex alignItems="center" mt="1.5rem">
          <Text>アカウント削除</Text>
          <Spacer />
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => {
              setIsDelete(false);
              deleteModal.onOpen();
            }}
          >
            アカウント削除
          </Button>
        </Flex>
      </Box>
      <Modal
        isOpen={logoutModal.isOpen}
        onClose={logoutModal.onClose}
        isCentered
      >
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
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アカウントを削除しますか？</ModalHeader>
          <ModalCloseButton size="lg" />
          <ModalBody>
            <Text>
              アカウントを削除すると、あなたのすべての情報は削除され復元することはできなくなります。
            </Text>
            <Text mt=".5rem">
              了承する場合は下記にチェックを入れてアカウントを削除してください。
            </Text>
            <Checkbox
              mt="1rem"
              onChange={v => {
                setIsDelete(v.target.checked);
              }}
              checked={isDelete}
            >
              アカウントを削除します
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={deleteHandler}
              isDisabled={!isDelete}
              isLoading={load}
            >
              アカウントを削除する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingAccountDanger;
