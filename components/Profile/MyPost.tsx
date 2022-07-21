import {Center, Box} from '@chakra-ui/react';

const MyPost = () => {
  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        投稿したやつ
      </Box>
    </Center>
  );
  //参考
  //   CREATE TABLE IF NOT EXISTS `entry` (
  //     `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
  //     `owner_user_id` INT UNSIGNED NOT NULL,
  //     `title` VARCHAR(512) NOT NULL,
  //     `shop_id` INT UNSIGNED NOT NULL,
  //     `number_of_people` INT UNSIGNED NOT NULL,
  //     `date` DATETIME NOT NULL,
  //     `body` TEXT,
  //     `is_closed` BOOLEAN NOT NULL,
  //     PRIMARY KEY (`id`)
  // );
};
export default MyPost;
