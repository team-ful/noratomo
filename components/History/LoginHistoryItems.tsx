import {Td, Tr} from '@chakra-ui/react';
import {parseElapsedDate} from '../../utils/parse';
import {LoginHistoryUserElements} from '../../utils/types';

const LoginHistoryItems = ({data}: {data: LoginHistoryUserElements}) => {
  const date = parseElapsedDate(new Date(data.login_date));

  return (
    <Tr>
      <Td>{date}</Td>
      <Td>{data.device_name}</Td>
      <Td>{data.ip_address}</Td>
    </Tr>
  );
};
export default LoginHistoryItems;
