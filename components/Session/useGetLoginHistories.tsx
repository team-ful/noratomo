import useSWR from 'swr';
import {fetcher} from '../../utils/swr';
import {LoginHistoryUserElements} from '../../utils/types';

const useGetLoginHistories = () => {
  const {data, error} = useSWR<LoginHistoryUserElements[], string>(
    '/api/user/login_history',
    fetcher<LoginHistoryUserElements[]>
  );

  return {
    data: data,
    error: error,
  };
};

export default useGetLoginHistories;
