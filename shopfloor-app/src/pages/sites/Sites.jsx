import useSWR from 'swr';
import { getAll } from '../../api';
import AsyncData from '../../components/AsyncData';
import SiteList from './SiteList';

const Sites = () => {
  const {
    data: sites = [],
    loading,
    error,
  } = useSWR('sites', getAll);

  return (
    <AsyncData loading={loading} error={error}>
      <SiteList sites={sites} loading={loading} error={error} />
    </AsyncData>
  )
};

export default Sites;
