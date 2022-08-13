import {Td, Tr} from '@chakra-ui/react';
import {LoginHistoryUserInfo} from '../../utils/types';

const ALoginHistory = ({data}: {data: LoginHistoryUserInfo}) => {
  return (
    <Tr>
      <Td>{data.login_date}</Td>
      <Td>{data.device_name}</Td>
      <Td>{data.ip_address}</Td>
    </Tr>
  );
};
export default ALoginHistory;
