import { getAll } from '../../api';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import NotificatieList from './NotificatieList';

const Notificaties = () => {

  const {
    data: notificaties,
    loading,
    error,
  } = useSWR('notificaties', getAll);

  return (
    <AsyncData loading={loading} error={error}>
      <NotificatieList notificaties={notificaties} />
    </AsyncData>
  );
};
export default Notificaties;