import {
  Box,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Center,
  useToast,
  Avatar,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import {useRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import {User} from '../../utils/types';
import Avater from '../Logo/Avater';

const SettingAvatar = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const editorRef = React.useRef<AvatarEditor>(null);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();

  const [user, setUser] = useRecoilState(UserState);
  const [image, setImage] = React.useState<File>(new File([], ''));
  const [zoom, setZoom] = React.useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      onOpen();
    }
  };

  const closeModal = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClose();
  };

  const apply = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();

      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'avatar', {type: 'image/png'});

          const f = async () => {
            const form = new FormData();
            form.append('image', file);

            const res = await fetch('/api/user/avatar', {
              method: 'POST',
              body: form,
            });

            if (res.ok) {
              toast({
                title: '更新しました',
                status: 'info',
              });

              const u = {...user} as User;
              u.avatar_url = await res.text();
              setUser(u);
            } else {
              toast({
                title: await res.text(),
                status: 'error',
              });
            }
          };

          f();
        }
      }, 'image/png');
    }

    onClose();
  };

  return (
    <>
      <Box>
        <Avatar
          size="xl"
          src={user?.avatar_url}
          icon={<Avater size="25px" />}
          boxShadow="10px 10px 30px #A0AEC0B3"
        />

        <label htmlFor="filename">
          <Link textAlign="center" as="p" mt=".5rem">
            変更する
          </Link>
          <Input
            ref={inputRef}
            display="none"
            id="filename"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      </Box>
      <Modal isOpen={isOpen} onClose={closeModal} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>画像をトリミングする</ModalHeader>
          <ModalCloseButton size="lg" />
          <ModalBody>
            <Box>
              <Center>
                <Box boxShadow="0 2px 10px 000" mb="1rem">
                  <AvatarEditor
                    ref={editorRef}
                    image={image}
                    width={250}
                    height={250}
                    border={0}
                    color={[113, 128, 150, 0.7]} // RGBA
                    scale={zoom}
                    rotate={0}
                    borderRadius={255}
                  />
                </Box>
              </Center>
              <Slider
                colorScheme="orange"
                aria-label="zoom"
                defaultValue={1}
                step={0.01}
                max={3}
                min={1}
                onChange={v => setZoom(v)}
                w="100%"
              >
                <SliderTrack bg="gray.400">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4} bgColor="#DD6B20" />
              </Slider>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={apply} width="100%">
              変更する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingAvatar;
