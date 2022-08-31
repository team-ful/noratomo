import {Box, Center, Td, Tooltip, Tr} from '@chakra-ui/react';
import {parseDate, parseElapsedDate} from '../../utils/parse';
import {LoginHistoryUserElements} from '../../utils/types';
import DeviceIcon from './DeviceIcon';

const LoginHistoryItems = ({data}: {data: LoginHistoryUserElements}) => {
  const date = new Date(data.login_date);
  const elaParsedDate = parseElapsedDate(date);
  const parsedDate = parseDate(date);

  return (
    <Tr>
      <Td>
        <Tooltip
          label={parsedDate}
          placement="top"
          hasArrow
          borderRadius="10px"
        >
          <Center>{elaParsedDate}</Center>
        </Tooltip>
      </Td>
      <Td>
        <Center>
          <DeviceIcon item={data} />
          <Box> / {data.os ?? '不明なOS'}</Box>
        </Center>
      </Td>
      <Td>
        <Center>{data.browser_name ?? '不明なブラウザ'}</Center>
      </Td>
      <Td>{data.ip_address}</Td>
    </Tr>
  );
};
export default LoginHistoryItems;
