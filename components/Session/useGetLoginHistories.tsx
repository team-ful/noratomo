import React from 'react';
import {LoginHistoryUserInfo} from '../../utils/types';

const useGetLoginHistories = (): LoginHistoryUserInfo[] => {
  const [logs, setLogs] = React.useState<LoginHistoryUserInfo[]>([]);

  const f = async () => {
    const res = await fetch('/api/user/login_history');
    const data = (await res.json()) as LoginHistoryUserInfo[];

    setLogs(data);
  };

  f();

  return logs;
};
export default useGetLoginHistories;
