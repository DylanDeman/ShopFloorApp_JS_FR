import React, { useState } from 'react';
import useSWR from 'swr';
import { getAll } from '../../api';
import AsyncData from '../../components/AsyncData';
import SiteList from './SiteList';
import { Pagination } from '../../components/genericComponents/Pagination';

const Sites = () => {
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const limit = 10; // Number of items per page (can be dynamic)

  // Fetch data using SWR, passing page and limit as query parameters
  const { data, loading, error } = useSWR(
    `sites?page=${currentPage}&limit=${limit}`, 
    getAll
  );

  const sites = data?.items || [];
  const pagination = data;
  
  return (
      <AsyncData loading={loading} error={error}>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} data={pagination} loading={loading} error={error}/>
        <SiteList sites={sites} loading={loading} error={error} />
      </AsyncData>
  );
};

export default Sites;
