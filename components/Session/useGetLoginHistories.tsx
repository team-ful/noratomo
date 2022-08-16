import React from 'react';
import {LoginHistoryUserElements} from '../../utils/types';

const useGetLoginHistories = (): LoginHistoryUserElements[] => {
  const [logs, setLogs] = React.useState<LoginHistoryUserElements[]>([]);

  const f = async () => {
    const res = await fetch('/api/user/login_history');
    const data = (await res.json()) as LoginHistoryUserElements[];

    setLogs(data);
  };

  f();

  return logs;
};
export default useGetLoginHistories;
