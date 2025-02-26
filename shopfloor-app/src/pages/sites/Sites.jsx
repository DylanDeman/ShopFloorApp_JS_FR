import useSWR from "swr";
import { getAll } from "../../api";
import AsyncData from '../../components/AsyncData';
import SitesList from "../../components/Sites/SitesList";

const Sites = () => {

  const {
    data: sites = [],
    loading,
    error,
  } = useSWR('sites', getAll);

  return (
    <AsyncData loading={loading} error={error}>
      <SitesList sites={sites}/>
    </AsyncData>
  );
};

export default Sites;
