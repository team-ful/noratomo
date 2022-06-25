import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';
import {Question} from '../../../utils/types';
import CreateNewNoraQuestion from './CreateNewNoraQuestion';
import useQuestion from './useQuestion';

const NoraQuestion = () => {
  const [selected, setSelected] = React.useState<Question>();
  const detailsModal = useDisclosure();
  const deleteModal = useDisclosure();
  const createModal = useDisclosure();

  const {
    questions,
    maxAnswerLength,
    getLoad,
    newQuestion,
    updateQuestion,
    removeQuestion,
  } = useQuestion();

  const AnswerScoreTh = React.useCallback(() => {
    return (
      <>
        {Array(maxAnswerLength)
          .fill(0)
          .map((_, i) => {
            return <Th key={`th_key_${i}`}>{`回答 ${i + 1}`}</Th>;
          })}
      </>
    );
  }, [maxAnswerLength]);

  return (
    <Box>
      <Heading textAlign="center">野良認証問題</Heading>
      <Button onClick={createModal.onOpen} colorScheme="blue" mb="1.5rem">
        新規作成
      </Button>
      <Skeleton isLoaded={!getLoad}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>タイトル</Th>
                <Th>スコア</Th>
                <AnswerScoreTh />
              </Tr>
            </Thead>
            <Tbody>
              {questions.map((v, i) => {
                return (
                  <Tr key={`tr_key_${i}`}>
                    <Td
                      onClick={() => {
                        setSelected(v);
                        detailsModal.onOpen();
                      }}
                      cursor="pointer"
                    >
                      {v.id}
                    </Td>
                    <Td>{v.question_title}</Td>
                    <Td>{v.score}</Td>
                    {v.answers.map((a, i) => {
                      return i === v.current_answer_index ? (
                        <Td key={`td_key_${i}`} bgColor="red.300">
                          {a.answerText}
                        </Td>
                      ) : (
                        <Td key={`td_key_${i}`}>{a.answerText}</Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Skeleton>
      {/* 野良認証問題の詳細ページ */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ID: {selected?.id} の編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                detailsModal.onClose();
                deleteModal.onOpen();
              }}
            >
              削除
            </Button>
            <Button mr={3} onClick={detailsModal.onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* 野良認証問題を削除するモーダル */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ID: {selected?.id} を削除しますか？</ModalHeader>
          <ModalCloseButton />
          <ModalBody>削除するともとに戻すことはできません。</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                if (selected?.id) {
                  const f = async () => {
                    await removeQuestion(selected.id);
                    deleteModal.onClose();
                  };

                  f();
                }
              }}
            >
              削除
            </Button>
            <Button mr={3} onClick={deleteModal.onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CreateNewNoraQuestion
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        create={newQuestion}
      />
    </Box>
  );
};

export default NoraQuestion;
