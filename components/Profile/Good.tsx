import {Center, Box} from '@chakra-ui/react';

const Good = () => {
  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        いいねしたやつ
      </Box>
    </Center>
  );
  //参考
  //   CREATE TABLE IF NOT EXISTS `application` (
  //     `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
  //     `shop_id` INT UNSIGNED NOT NULL,
  //     `user_id` INT UNSIGNED NOT NULL,
  //     `entry_id` INT UNSIGNED NOT NULL,
  //     `body` TEXT,
  //     `apply_date` DATETIME NOT NULL,
  //     `is_meeted` BOOLEAN NOT NULL,
  //     PRIMARY KEY (`id`)
  // );
};
export default Good;
