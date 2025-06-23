import React from 'react';
import JobListBase from '../common/job-list-base';
import { useNavigate } from 'react-router-dom';

function AdminJobList() {
  const navigate = useNavigate();
  
  return (
    <JobListBase
      showEdit={true}
      onBack={() => navigate('..')}
      enableSearch={false}
      enablePagination={false}
    />
  );
}

export default AdminJobList;