import { useParams } from 'react-router';
import AsyncData from '../../components/AsyncData';
import { getById } from '../../api';
import useSWR from 'swr';
import OnderhoudenList from '../../components/onderhouden/OnderhoudenList';

export default function Onderhouden (){
  const {id} = useParams();
  const {
    data: machine,
    isLoading,
    error,
  } = useSWR(`machines/${id}`, getById);
  return (
    <>
      <AsyncData loading={isLoading} error={error}>
        <OnderhoudenList machine={machine}/>
      </AsyncData>
    </>
  );
}