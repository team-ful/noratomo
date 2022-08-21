import {Center, Td, Tooltip, Tr} from '@chakra-ui/react';
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
        <Center>
          <Tooltip label={parsedDate} placement="top">
            {elaParsedDate}
          </Tooltip>
        </Center>
      </Td>
      <Td>
        <Center>
          <DeviceIcon item={data} />
        </Center>
      </Td>
      <Td>
        <Center>
          {data.browser_name} / {data.os}
        </Center>
      </Td>
      <Td>{data.ip_address}</Td>
    </Tr>
  );
};
export default LoginHistoryItems;
