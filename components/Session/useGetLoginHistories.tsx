import {useToast} from '@chakra-ui/react';
import React from 'react';
import {LoginHistoryUserElements} from '../../utils/types';

const useGetLoginHistories = (): LoginHistoryUserElements[] => {
  const [logs, setLogs] = React.useState<LoginHistoryUserElements[]>([]);
  const toast = useToast();
  const f = async () => {
    const res = await fetch('/api/user/login_history');
    if (!res.ok) {
      toast({
        status: 'error',
        title: await res.text(),
      });
      return;
    }

    const data = (await res.json()) as LoginHistoryUserElements[];
    setLogs(data);
  };

  f();

  return logs;
};
export default useGetLoginHistories;
