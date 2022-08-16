import {Td, Tr} from '@chakra-ui/react';
import {LoginHistoryUserElements} from '../../utils/types';

const LoginHistoryItems = ({data}: {data: LoginHistoryUserElements}) => {
  const date = data.login_date.toString();

  return (
    <Tr>
      <Td>{date}</Td>
      <Td>{data.device_name}</Td>
      <Td>{data.ip_address}</Td>
    </Tr>
  );
};
export default LoginHistoryItems;
