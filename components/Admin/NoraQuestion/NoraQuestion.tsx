import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Link,
} from '@chakra-ui/react';
import React from 'react';
import {Question} from '../../../utils/types';
import CreateNewNoraQuestion from './CreateNewNoraQuestion';
import UpdateNoraQuestion from './UpdataNoraQuestion';
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
      <Heading textAlign="center">
        野良認証問題（全{questions.length}件）
      </Heading>
      <Button onClick={createModal.onOpen} mb="1.5rem" ml="1rem">
        新規作成
      </Button>
      <Box overflow="scroll">
        <Box width="100vw">
          <Skeleton isLoaded={!getLoad} overflowX="scroll">
            <Table variant="simple" minWidth="1000px">
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
                      <Td>
                        <Link
                          as="p"
                          onClick={() => {
                            setSelected(v);
                            detailsModal.onOpen();
                          }}
                        >
                          {v.id}
                        </Link>
                      </Td>
                      <Td minW="100px">{v.question_title}</Td>
                      <Td>{v.score}</Td>
                      {v.answers.map((a, i) => {
                        return i === v.current_answer_index ? (
                          <Td
                            key={`td_key_${i}`}
                            bgColor="red.300"
                            minW="100px"
                          >
                            {a.answerText}
                          </Td>
                        ) : (
                          <Td key={`td_key_${i}`} minW="100px">
                            {a.answerText}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Skeleton>
        </Box>
        <UpdateNoraQuestion
          onClose={detailsModal.onClose}
          isOpen={detailsModal.isOpen}
          onCloseModalOpen={deleteModal.onOpen}
          defaultQuestion={selected}
          update={updateQuestion}
        />
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
                mr=".5rem"
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
    </Box>
  );
};

export default NoraQuestion;
