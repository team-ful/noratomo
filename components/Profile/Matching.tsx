import {Box, Center} from '@chakra-ui/react';

const MatchingResult = () => {
  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        マッチングの経過
      </Box>
    </Center>
  );
  //参考データベーススキーマ
  //   CREATE TABLE IF NOT EXISTS `number_of` (
  //     `user_id` INT UNSIGNED UNIQUE NOT NULL,
  //     `evaluations` MEDIUMINT UNSIGNED,
  //     `meet` MEDIUMINT UNSIGNED,
  //     `application` MEDIUMINT UNSIGNED,
  //     PRIMARY KEY (`user_id`)
  // );
};

export default MatchingResult;
